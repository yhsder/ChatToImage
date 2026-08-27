/**
 * Server-side runner for settings tests.
 *
 * Safe side effects only: no orders are persisted, no webhooks fire —
 * just raw provider SDK calls to prove credentials work.
 *
 * Spec data lives in ./settings-test-specs so the client bundle can
 * import it without pulling provider SDKs.
 */

import { FalProvider } from '@/core/ai/fal';
import { KieProvider } from '@/core/ai/kie';
import { ReplicateProvider } from '@/core/ai/replicate';
import { AIMediaType } from '@/core/ai/types';
import { ResendProvider } from '@/core/email/resend';
import {
  AlipayProvider,
  CreemProvider,
  PayPalProvider,
  StripeProvider,
  WechatPayProvider,
} from '@/core/payment';
import { PaymentType, type PaymentOrder } from '@/core/payment/types';
import { R2Provider } from '@/core/storage/r2';
import { envConfigs } from '@/config';
import { getUniSeq } from '@/lib/hash';

import type { TestResult } from './settings-test-specs';

export { getTestSpec, getTestableGroups } from './settings-test-specs';
export type { TestField, TestSpec, TestResult } from './settings-test-specs';

export async function runTest(
  group: string,
  inputs: Record<string, string>,
  configs: Record<string, string>
): Promise<TestResult> {
  try {
    switch (group) {
      case 'resend':
        return await testResend(inputs, configs);
      case 'stripe':
        return await testStripe(inputs, configs);
      case 'creem':
        return await testCreem(inputs, configs);
      case 'paypal':
        return await testPaypal(inputs, configs);
      case 'alipay':
        return await testAlipay(inputs, configs);
      case 'wechat':
        return await testWechat(inputs, configs);
      case 'r2':
        return await testR2(inputs, configs);
      case 'openai':
        return await testOpenAI(inputs, configs);
      case 'anthropic':
        return await testAnthropic(inputs, configs);
      case 'replicate':
        return await testReplicate(inputs, configs);
      case 'fal':
        return await testFal(inputs, configs);
      case 'kie':
        return await testKie(inputs, configs);
      default:
        return { success: false, message: `No test available for "${group}"` };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Test failed with unknown error',
    };
  }
}

function need(configs: Record<string, string>, keys: string[]): string | null {
  const missing = keys.filter((k) => !configs[k]);
  return missing.length ? `Missing config: ${missing.join(', ')}` : null;
}

function configuredAppName(configs: Record<string, string>) {
  return configs.app_name || envConfigs.app_name;
}

function configuredSuccessUrl(group: string, configs: Record<string, string>) {
  return `${configs.app_url || envConfigs.app_url || 'http://localhost:3000'}/admin/settings?test=${group}`;
}

// --- Resend ---------------------------------------------------------------

async function testResend(
  inputs: Record<string, string>,
  configs: Record<string, string>
): Promise<TestResult> {
  const missing = need(configs, ['resend_api_key', 'resend_sender_email']);
  if (missing) return { success: false, message: missing };

  const provider = new ResendProvider({
    apiKey: configs.resend_api_key,
    defaultFrom: configs.resend_sender_email,
  });

  const result = await provider.sendEmail({
    to: inputs.to,
    subject: `[${configuredAppName(configs)}] Test email`,
    text: `This is a test email from ${configuredAppName(configs)} admin settings. If you received it, Resend is configured correctly.`,
  });

  if (!result.success) {
    return { success: false, message: result.error || 'Send failed' };
  }

  return {
    success: true,
    message: 'Email sent successfully',
    details: result.messageId ? { 'Message ID': result.messageId } : undefined,
  };
}

// --- Stripe ---------------------------------------------------------------

async function testStripe(
  inputs: Record<string, string>,
  configs: Record<string, string>
): Promise<TestResult> {
  const key = configs.stripe_secret_key || configs.stripe_api_key;
  if (!key)
    return { success: false, message: 'Missing config: stripe_secret_key' };

  const provider = new StripeProvider({
    secretKey: key,
    publishableKey: configs.stripe_publishable_key || '',
    signingSecret:
      configs.stripe_signing_secret ||
      configs.stripe_webhook_secret ||
      undefined,
    allowedPaymentMethods: ['card'],
  });

  const order: PaymentOrder = {
    type: PaymentType.ONE_TIME,
    orderNo: getUniSeq('TEST'),
    price: {
      amount: Number(inputs.amount) || 100,
      currency: (inputs.currency || 'usd').toLowerCase(),
    },
    description: inputs.description || 'Test checkout',
    successUrl: configuredSuccessUrl('stripe', configs),
    cancelUrl: configuredSuccessUrl('stripe', configs),
  };

  const session = await provider.createPayment({ order });
  return {
    success: true,
    message: 'Checkout session created',
    details: {
      'Session ID': session.checkoutInfo.sessionId,
      'Checkout URL': session.checkoutInfo.checkoutUrl,
    },
  };
}

// --- Creem ----------------------------------------------------------------

async function testCreem(
  inputs: Record<string, string>,
  configs: Record<string, string>
): Promise<TestResult> {
  const missing = need(configs, ['creem_api_key']);
  if (missing) return { success: false, message: missing };

  const provider = new CreemProvider({
    apiKey: configs.creem_api_key,
    signingSecret: configs.creem_signing_secret || undefined,
    environment:
      configs.creem_environment === 'production' ? 'production' : 'sandbox',
  });

  const order: PaymentOrder = {
    type: PaymentType.ONE_TIME,
    orderNo: getUniSeq('TEST'),
    productId: inputs.productId,
    description: inputs.description || 'Test checkout',
    successUrl: configuredSuccessUrl('creem', configs),
    cancelUrl: configuredSuccessUrl('creem', configs),
  };

  const session = await provider.createPayment({ order });
  return {
    success: true,
    message: 'Checkout session created',
    details: {
      'Session ID': session.checkoutInfo.sessionId,
      'Checkout URL': session.checkoutInfo.checkoutUrl,
    },
  };
}

// --- PayPal ---------------------------------------------------------------

async function testPaypal(
  inputs: Record<string, string>,
  configs: Record<string, string>
): Promise<TestResult> {
  const missing = need(configs, ['paypal_client_id', 'paypal_client_secret']);
  if (missing) return { success: false, message: missing };

  const provider = new PayPalProvider({
    clientId: configs.paypal_client_id,
    clientSecret: configs.paypal_client_secret,
    environment:
      configs.paypal_environment === 'live' ? 'production' : 'sandbox',
    webhookId: configs.paypal_webhook_id || undefined,
  });

  const order: PaymentOrder = {
    type: PaymentType.ONE_TIME,
    orderNo: getUniSeq('TEST'),
    price: {
      amount: Number(inputs.amount) || 100,
      currency: (inputs.currency || 'USD').toUpperCase(),
    },
    description: inputs.description || 'Test checkout',
    successUrl: configuredSuccessUrl('paypal', configs),
    cancelUrl: configuredSuccessUrl('paypal', configs),
  };

  const session = await provider.createPayment({ order });
  return {
    success: true,
    message: 'Checkout session created',
    details: {
      'Order ID': session.checkoutInfo.sessionId,
      'Approval URL': session.checkoutInfo.checkoutUrl,
    },
  };
}

// --- Alipay ---------------------------------------------------------------

async function testAlipay(
  inputs: Record<string, string>,
  configs: Record<string, string>
): Promise<TestResult> {
  const missing = need(configs, [
    'alipay_app_id',
    'alipay_private_key',
    'alipay_public_key',
  ]);
  if (missing) return { success: false, message: missing };

  const provider = new AlipayProvider({
    appId: configs.alipay_app_id,
    privateKey: configs.alipay_private_key,
    alipayPublicKey: configs.alipay_public_key,
    notifyUrl: configs.alipay_notify_url || undefined,
  });

  const order: PaymentOrder = {
    type: PaymentType.ONE_TIME,
    orderNo: getUniSeq('TEST'),
    price: { amount: Number(inputs.amount) || 1, currency: 'CNY' },
    description: inputs.description || 'Test checkout',
    successUrl: configuredSuccessUrl('alipay', configs),
  };

  const session = await provider.createPayment({ order });
  return {
    success: true,
    message: 'Checkout created',
    details: {
      'Order No': session.checkoutInfo.sessionId,
      'Checkout URL': session.checkoutInfo.checkoutUrl,
    },
  };
}

// --- WeChat Pay -----------------------------------------------------------

async function testWechat(
  inputs: Record<string, string>,
  configs: Record<string, string>
): Promise<TestResult> {
  const missing = need(configs, [
    'wechat_app_id',
    'wechat_mch_id',
    'wechat_private_key',
    'wechat_api_v3_key',
    'wechat_serial_no',
  ]);
  if (missing) return { success: false, message: missing };

  const provider = new WechatPayProvider({
    appId: configs.wechat_app_id,
    mchId: configs.wechat_mch_id,
    apiV3Key: configs.wechat_api_v3_key,
    privateKey: configs.wechat_private_key,
    serialNo: configs.wechat_serial_no,
    notifyUrl: configs.wechat_notify_url || undefined,
  });

  const order: PaymentOrder = {
    type: PaymentType.ONE_TIME,
    orderNo: getUniSeq('TEST'),
    price: { amount: Number(inputs.amount) || 1, currency: 'CNY' },
    description: inputs.description || 'Test checkout',
  };

  const session = await provider.createPayment({ order });
  return {
    success: true,
    message: 'Checkout created',
    details: {
      'Order No': session.checkoutInfo.sessionId,
      'Checkout URL': session.checkoutInfo.checkoutUrl,
    },
  };
}

// --- Storage --------------------------------------------------------------

async function testR2(
  inputs: Record<string, string>,
  configs: Record<string, string>
): Promise<TestResult> {
  const missing = need(configs, [
    'r2_access_key',
    'r2_secret_key',
    'r2_bucket_name',
  ]);
  if (missing) return { success: false, message: missing };

  const provider = new R2Provider({
    accountId: configs.r2_account_id || '',
    accessKeyId: configs.r2_access_key,
    secretAccessKey: configs.r2_secret_key,
    bucket: configs.r2_bucket_name,
    uploadPath: configs.r2_upload_path,
    region: 'auto',
    endpoint: configs.r2_endpoint || undefined,
    publicDomain: configs.r2_domain || undefined,
  });

  const safeName = (inputs.filename || 'shipany-settings-test.txt').replace(
    /[^a-zA-Z0-9._-]/g,
    '_'
  );
  const key = `settings-test/${Date.now()}-${safeName}`;
  const body = Buffer.from(
    `ShipAny settings test\nTimestamp: ${new Date().toISOString()}\n`,
    'utf-8'
  );

  const result = await provider.uploadFile({
    body,
    key,
    contentType: 'text/plain',
  });

  if (!result.success) {
    return { success: false, message: result.error || 'Upload failed' };
  }

  const details: Record<string, string> = { Key: key };
  if (result.url) details['URL'] = result.url;
  if (result.location) details['Location'] = result.location;
  return { success: true, message: 'Uploaded test object', details };
}

// --- AI -------------------------------------------------------------------

async function testOpenAI(
  inputs: Record<string, string>,
  configs: Record<string, string>
): Promise<TestResult> {
  const missing = need(configs, ['openai_api_key']);
  if (missing) return { success: false, message: missing };

  const baseUrl = (
    configs.openai_base_url || 'https://api.openai.com/v1'
  ).replace(/\/+$/, '');
  const resp = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${configs.openai_api_key}`,
    },
    body: JSON.stringify({
      model: inputs.model,
      messages: [{ role: 'user', content: inputs.prompt }],
      max_tokens: 64,
    }),
  });

  const data: any = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    return {
      success: false,
      message: data?.error?.message || `Request failed (${resp.status})`,
    };
  }

  const reply = String(data?.choices?.[0]?.message?.content ?? '').trim();
  return {
    success: true,
    message: 'OpenAI accepted the request',
    details: {
      Model: data?.model || inputs.model,
      Reply: reply.slice(0, 200) || '(empty)',
    },
  };
}

async function testAnthropic(
  inputs: Record<string, string>,
  configs: Record<string, string>
): Promise<TestResult> {
  const missing = need(configs, ['anthropic_api_key']);
  if (missing) return { success: false, message: missing };

  const baseUrl = (
    configs.anthropic_base_url || 'https://api.anthropic.com'
  ).replace(/\/+$/, '');
  const resp = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': configs.anthropic_api_key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: inputs.model,
      max_tokens: 64,
      messages: [{ role: 'user', content: inputs.prompt }],
    }),
  });

  const data: any = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    return {
      success: false,
      message: data?.error?.message || `Request failed (${resp.status})`,
    };
  }

  const reply = Array.isArray(data?.content)
    ? data.content
        .map((b: any) => b?.text || '')
        .join('')
        .trim()
    : '';
  return {
    success: true,
    message: 'Anthropic accepted the request',
    details: {
      Model: data?.model || inputs.model,
      Reply: reply.slice(0, 200) || '(empty)',
    },
  };
}

async function testReplicate(
  inputs: Record<string, string>,
  configs: Record<string, string>
): Promise<TestResult> {
  const missing = need(configs, ['replicate_api_token']);
  if (missing) return { success: false, message: missing };

  const provider = new ReplicateProvider({
    apiToken: configs.replicate_api_token,
  });
  const result = await provider.generate({
    params: {
      mediaType: AIMediaType.IMAGE,
      model: inputs.model,
      prompt: inputs.prompt,
    },
  });
  return {
    success: true,
    message: 'Replicate accepted the request',
    details: { 'Task ID': result.taskId, Status: result.taskStatus },
  };
}

async function testFal(
  inputs: Record<string, string>,
  configs: Record<string, string>
): Promise<TestResult> {
  const missing = need(configs, ['fal_api_key']);
  if (missing) return { success: false, message: missing };

  const provider = new FalProvider({ apiKey: configs.fal_api_key });
  const result = await provider.generate({
    params: {
      mediaType: AIMediaType.IMAGE,
      model: inputs.model,
      prompt: inputs.prompt,
    },
  });
  return {
    success: true,
    message: 'Fal accepted the request',
    details: { 'Task ID': result.taskId, Status: result.taskStatus },
  };
}

async function testKie(
  inputs: Record<string, string>,
  configs: Record<string, string>
): Promise<TestResult> {
  const missing = need(configs, ['kie_api_key']);
  if (missing) return { success: false, message: missing };

  const provider = new KieProvider({ apiKey: configs.kie_api_key });
  const result = await provider.generate({
    params: {
      mediaType: AIMediaType.IMAGE,
      model: inputs.model,
      prompt: inputs.prompt,
    },
  });
  return {
    success: true,
    message: 'KIE accepted the request',
    details: { 'Task ID': result.taskId, Status: result.taskStatus },
  };
}
