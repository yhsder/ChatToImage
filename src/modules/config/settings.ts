/**
 * Settings definitions — tabs, groups, and fields.
 *
 * This drives the admin settings UI. Add new settings here
 * and they'll automatically appear in the admin panel.
 */

export interface Setting {
  name: string;
  title: string;
  type: 'text' | 'password' | 'textarea' | 'number' | 'switch' | 'select';
  placeholder?: string;
  options?: { label: string; value: string }[];
  tip?: string;
  group: string;
  tab: string;
  defaultValue?: string;
}

export interface SettingGroup {
  name: string;
  title: string;
  description?: string;
  tab: string;
}

export interface SettingTab {
  name: string;
  title: string;
}

export function getSettingTabs(): SettingTab[] {
  return [
    { name: 'general', title: 'General' },
    { name: 'auth', title: 'Auth' },
    { name: 'payment', title: 'Payment' },
    { name: 'email', title: 'Email' },
    { name: 'storage', title: 'Storage' },
    { name: 'ai', title: 'AI' },
    { name: 'analytics', title: 'Analytics' },
    { name: 'ads', title: 'Ads' },
    { name: 'customer_service', title: 'Customer Service' },
    { name: 'custom', title: 'Custom' },
  ];
}

export function getSettingGroups(): SettingGroup[] {
  return [
    // General
    {
      name: 'appinfo',
      title: 'App Info',
      description: 'Basic application settings',
      tab: 'general',
    },
    {
      name: 'user_role',
      title: 'User Roles',
      description: 'Default role for new users',
      tab: 'general',
    },
    {
      name: 'credit',
      title: 'Credits',
      description: 'Initial credits for new users',
      tab: 'general',
    },

    // Auth
    {
      name: 'email_auth',
      title: 'Email Auth',
      description: 'Email/password authentication',
      tab: 'auth',
    },
    {
      name: 'google_auth',
      title: 'Google Auth',
      description: 'Google OAuth login',
      tab: 'auth',
    },
    {
      name: 'github_auth',
      title: 'GitHub Auth',
      description: 'GitHub OAuth login',
      tab: 'auth',
    },

    // Payment
    {
      name: 'basic_payment',
      title: 'Basic',
      description: 'Payment general settings',
      tab: 'payment',
    },
    {
      name: 'stripe',
      title: 'Stripe',
      description: 'Stripe payment gateway',
      tab: 'payment',
    },
    {
      name: 'creem',
      title: 'Creem',
      description: 'Creem payment gateway',
      tab: 'payment',
    },
    {
      name: 'paypal',
      title: 'PayPal',
      description: 'PayPal payment gateway',
      tab: 'payment',
    },
    {
      name: 'alipay',
      title: 'Alipay',
      description: 'Alipay payment gateway (native)',
      tab: 'payment',
    },
    {
      name: 'wechat',
      title: 'WeChat Pay',
      description: 'WeChat Pay gateway (native)',
      tab: 'payment',
    },

    // Email
    {
      name: 'email_general',
      title: 'General',
      description: 'Email provider selection',
      tab: 'email',
    },
    {
      name: 'resend',
      title: 'Resend',
      description: 'Resend email service',
      tab: 'email',
    },
    {
      name: 'cloudflare_email',
      title: 'Cloudflare Email',
      description: 'Cloudflare Email Service',
      tab: 'email',
    },

    // Storage
    {
      name: 'r2',
      title: 'Cloudflare R2 / S3',
      description: 'Object storage settings',
      tab: 'storage',
    },

    // AI
    {
      name: 'openai',
      title: 'OpenAI',
      description: 'OpenAI (or compatible) API',
      tab: 'ai',
    },
    {
      name: 'anthropic',
      title: 'Anthropic',
      description: 'Anthropic Claude API',
      tab: 'ai',
    },
    {
      name: 'replicate',
      title: 'Replicate',
      description: 'Replicate AI API',
      tab: 'ai',
    },
    { name: 'fal', title: 'Fal', description: 'Fal AI API', tab: 'ai' },
    {
      name: 'kie',
      title: 'KIE',
      description: 'KIE image-to-image API',
      tab: 'ai',
    },

    // Analytics
    {
      name: 'google_analytics',
      title: 'Google Analytics',
      description: 'Inject gtag.js with the configured Measurement ID',
      tab: 'analytics',
    },
    {
      name: 'plausible',
      title: 'Plausible',
      description: 'Inject plausible.js for self-hosted or cloud Plausible',
      tab: 'analytics',
    },

    // Ads
    {
      name: 'adsense',
      title: 'Google AdSense',
      description:
        'Inject the AdSense script sitewide and serve /ads.txt from the configured publisher ID',
      tab: 'ads',
    },

    // Customer Service
    {
      name: 'crisp',
      title: 'Crisp',
      description: 'Crisp live chat widget',
      tab: 'customer_service',
    },
    {
      name: 'tawk',
      title: 'Tawk.to',
      description: 'Tawk.to live chat widget',
      tab: 'customer_service',
    },
  ];
}

export function getSettings(): Setting[] {
  return [
    // ─── General / App Info ──────────────────────────────────────────
    {
      name: 'app_name',
      title: 'App Name',
      type: 'text',
      placeholder: 'My App',
      group: 'appinfo',
      tab: 'general',
    },
    {
      name: 'app_description',
      title: 'App Description',
      type: 'textarea',
      placeholder: 'Ship your SaaS faster',
      group: 'appinfo',
      tab: 'general',
    },
    {
      name: 'app_url',
      title: 'App URL',
      type: 'text',
      placeholder: 'https://example.com',
      group: 'appinfo',
      tab: 'general',
    },

    // ─── General / User Roles ────────────────────────────────────────
    {
      name: 'initial_role_enabled',
      title: 'Auto-assign role for new users',
      type: 'switch',
      group: 'user_role',
      tab: 'general',
    },
    {
      name: 'initial_role_name',
      title: 'Default role name',
      type: 'text',
      placeholder: 'viewer',
      group: 'user_role',
      tab: 'general',
    },

    // ─── General / Credits ───────────────────────────────────────────
    {
      name: 'initial_credits_enabled',
      title: 'Grant credits on signup',
      type: 'switch',
      group: 'credit',
      tab: 'general',
    },
    {
      name: 'initial_credits_amount',
      title: 'Credits amount',
      type: 'number',
      placeholder: '100',
      group: 'credit',
      tab: 'general',
    },
    {
      name: 'initial_credits_valid_days',
      title: 'Valid days',
      type: 'number',
      placeholder: '365',
      group: 'credit',
      tab: 'general',
    },
    {
      name: 'initial_credits_description',
      title: 'Description',
      type: 'text',
      placeholder: 'Welcome bonus',
      group: 'credit',
      tab: 'general',
    },

    // ─── Auth / Email ────────────────────────────────────────────────
    {
      name: 'email_auth_enabled',
      title: 'Enable email auth',
      type: 'switch',
      group: 'email_auth',
      tab: 'auth',
      defaultValue: 'true',
    },
    {
      name: 'email_verification_enabled',
      title: 'Require email verification on sign up',
      type: 'switch',
      group: 'email_auth',
      tab: 'auth',
      defaultValue: 'false',
    },
    {
      name: 'invite_code_required',
      title: 'Require invite code on sign up',
      type: 'switch',
      group: 'email_auth',
      tab: 'auth',
      defaultValue: 'false',
    },
    {
      name: 'desktop_auth_schemes',
      title: 'Desktop hand-off schemes',
      type: 'text',
      placeholder: 'myapp,myapp-dev',
      group: 'email_auth',
      tab: 'auth',
    },

    // ─── Auth / Google ───────────────────────────────────────────────
    {
      name: 'google_auth_enabled',
      title: 'Enable Google auth',
      type: 'switch',
      group: 'google_auth',
      tab: 'auth',
    },
    {
      name: 'google_one_tap_enabled',
      title: 'Enable Google One Tap',
      type: 'switch',
      group: 'google_auth',
      tab: 'auth',
      tip: 'Show the Google One Tap prompt to signed-out visitors. Requires Client ID.',
    },
    {
      name: 'google_client_id',
      title: 'Client ID',
      type: 'text',
      placeholder: 'xxx.apps.googleusercontent.com',
      group: 'google_auth',
      tab: 'auth',
    },
    {
      name: 'google_client_secret',
      title: 'Client Secret',
      type: 'password',
      placeholder: 'GOCSPX-xxx',
      group: 'google_auth',
      tab: 'auth',
    },

    // ─── Auth / GitHub ───────────────────────────────────────────────
    {
      name: 'github_auth_enabled',
      title: 'Enable GitHub auth',
      type: 'switch',
      group: 'github_auth',
      tab: 'auth',
    },
    {
      name: 'github_client_id',
      title: 'Client ID',
      type: 'text',
      placeholder: 'Ov23xxx',
      group: 'github_auth',
      tab: 'auth',
    },
    {
      name: 'github_client_secret',
      title: 'Client Secret',
      type: 'password',
      placeholder: 'xxx',
      group: 'github_auth',
      tab: 'auth',
    },

    // ─── Payment / Basic ─────────────────────────────────────────────
    {
      name: 'select_payment_enabled',
      title: 'Show payment method selector',
      type: 'switch',
      group: 'basic_payment',
      tab: 'payment',
    },
    {
      name: 'default_payment_provider',
      title: 'Default provider',
      type: 'select',
      options: [
        { label: 'Stripe', value: 'stripe' },
        { label: 'Creem', value: 'creem' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'Alipay', value: 'alipay' },
        { label: 'WeChat Pay', value: 'wechat' },
      ],
      group: 'basic_payment',
      tab: 'payment',
    },

    // ─── Payment / Stripe ────────────────────────────────────────────
    {
      name: 'stripe_enabled',
      title: 'Enable Stripe',
      type: 'switch',
      group: 'stripe',
      tab: 'payment',
    },
    {
      name: 'stripe_publishable_key',
      title: 'Publishable Key',
      type: 'text',
      placeholder: 'pk_xxx',
      group: 'stripe',
      tab: 'payment',
    },
    {
      name: 'stripe_secret_key',
      title: 'Secret Key',
      type: 'password',
      placeholder: 'sk_xxx',
      group: 'stripe',
      tab: 'payment',
    },
    {
      name: 'stripe_signing_secret',
      title: 'Webhook Signing Secret',
      type: 'password',
      placeholder: 'whsec_xxx',
      group: 'stripe',
      tab: 'payment',
    },

    // ─── Payment / Creem ─────────────────────────────────────────────
    {
      name: 'creem_enabled',
      title: 'Enable Creem',
      type: 'switch',
      group: 'creem',
      tab: 'payment',
    },
    {
      name: 'creem_environment',
      title: 'Environment',
      type: 'select',
      options: [
        { label: 'Sandbox', value: 'sandbox' },
        { label: 'Production', value: 'production' },
      ],
      group: 'creem',
      tab: 'payment',
      defaultValue: 'sandbox',
    },
    {
      name: 'creem_api_key',
      title: 'API Key',
      type: 'password',
      placeholder: 'creem_xxx',
      group: 'creem',
      tab: 'payment',
    },
    {
      name: 'creem_signing_secret',
      title: 'Signing Secret',
      type: 'password',
      placeholder: 'whsec_xxx',
      group: 'creem',
      tab: 'payment',
    },
    {
      name: 'creem_product_ids_mapping',
      title: 'Product IDs Mapping',
      type: 'textarea',
      placeholder: '{"starter_monthly": "prod_xxx"}',
      tip: 'Map the product_id in pricing catalog to the product ID created in Creem. Must be a valid JSON object.',
      group: 'creem',
      tab: 'payment',
    },
    {
      name: 'creem_test_amount',
      title: 'Test amount (cents)',
      type: 'number',
      placeholder: '留空使用实际金额，填 1 则支付 $0.01',
      group: 'creem',
      tab: 'payment',
    },

    // ─── Payment / PayPal ────────────────────────────────────────────
    {
      name: 'paypal_enabled',
      title: 'Enable PayPal',
      type: 'switch',
      group: 'paypal',
      tab: 'payment',
    },
    {
      name: 'paypal_client_id',
      title: 'Client ID',
      type: 'text',
      placeholder: 'xxx',
      group: 'paypal',
      tab: 'payment',
    },
    {
      name: 'paypal_client_secret',
      title: 'Client Secret',
      type: 'password',
      placeholder: 'xxx',
      group: 'paypal',
      tab: 'payment',
    },
    {
      name: 'paypal_webhook_id',
      title: 'Webhook ID',
      type: 'text',
      placeholder: 'xxx',
      group: 'paypal',
      tab: 'payment',
    },
    {
      name: 'paypal_environment',
      title: 'Environment',
      type: 'select',
      options: [
        { label: 'Sandbox', value: 'sandbox' },
        { label: 'Live', value: 'live' },
      ],
      group: 'paypal',
      tab: 'payment',
    },
    {
      name: 'paypal_test_amount',
      title: 'Test amount (cents)',
      type: 'number',
      placeholder: '留空使用实际金额，填 1 则支付 $0.01',
      group: 'paypal',
      tab: 'payment',
    },

    // ─── Payment / Alipay ─────────────────────────────────────────────
    {
      name: 'alipay_enabled',
      title: 'Enable Alipay',
      type: 'switch',
      group: 'alipay',
      tab: 'payment',
    },
    {
      name: 'alipay_app_id',
      title: 'App ID',
      type: 'text',
      placeholder: '2021xxx',
      group: 'alipay',
      tab: 'payment',
    },
    {
      name: 'alipay_private_key',
      title: 'Private Key (RSA2)',
      type: 'textarea',
      placeholder: 'MIIEvQIBADANBgkq...',
      group: 'alipay',
      tab: 'payment',
    },
    {
      name: 'alipay_public_key',
      title: 'Alipay Public Key',
      type: 'textarea',
      placeholder: 'MIIBIjANBgkq...',
      group: 'alipay',
      tab: 'payment',
    },
    {
      name: 'alipay_notify_url',
      title: 'Notify URL (Webhook)',
      type: 'text',
      placeholder: 'https://hersoul.cn/api/payment/notify/alipay',
      group: 'alipay',
      tab: 'payment',
    },
    {
      name: 'alipay_test_amount',
      title: 'Test amount (分)',
      type: 'number',
      placeholder: '留空使用实际金额，填 1 则支付 ¥0.01',
      group: 'alipay',
      tab: 'payment',
    },

    // ─── Payment / WeChat Pay ───────────────────────────────────────
    {
      name: 'wechat_enabled',
      title: 'Enable WeChat Pay',
      type: 'switch',
      group: 'wechat',
      tab: 'payment',
    },
    {
      name: 'wechat_app_id',
      title: 'AppID',
      type: 'text',
      placeholder: 'wx1234567890',
      group: 'wechat',
      tab: 'payment',
    },
    {
      name: 'wechat_mch_id',
      title: 'Merchant ID (商户号)',
      type: 'text',
      placeholder: '1900000001',
      group: 'wechat',
      tab: 'payment',
    },
    {
      name: 'wechat_api_v3_key',
      title: 'APIv3 Key (32位密钥)',
      type: 'password',
      placeholder: '32 chars',
      group: 'wechat',
      tab: 'payment',
    },
    {
      name: 'wechat_private_key',
      title: 'Merchant Private Key (PEM)',
      type: 'textarea',
      placeholder: 'MIIEvgIBADANBgkq...',
      group: 'wechat',
      tab: 'payment',
    },
    {
      name: 'wechat_serial_no',
      title: 'Certificate Serial No',
      type: 'text',
      placeholder: 'xxx',
      group: 'wechat',
      tab: 'payment',
    },
    {
      name: 'wechat_notify_url',
      title: 'Notify URL (Webhook)',
      type: 'text',
      placeholder: 'https://hersoul.cn/api/payment/notify/wechat',
      group: 'wechat',
      tab: 'payment',
    },
    {
      name: 'wechat_test_amount',
      title: 'Test amount (分)',
      type: 'number',
      placeholder: '留空使用实际金额，填 1 则支付 ¥0.01',
      group: 'wechat',
      tab: 'payment',
    },

    // ─── Email / General ────────────────────────────────────────────
    {
      name: 'email_provider',
      title: 'Email Provider',
      type: 'select',
      options: [
        { label: 'Resend', value: 'resend' },
        { label: 'Cloudflare Email', value: 'cloudflare' },
      ],
      group: 'email_general',
      tab: 'email',
      defaultValue: 'resend',
    },

    // ─── Email / Resend ──────────────────────────────────────────────
    {
      name: 'resend_api_key',
      title: 'API Key',
      type: 'password',
      placeholder: 're_xxx',
      group: 'resend',
      tab: 'email',
    },
    {
      name: 'resend_sender_email',
      title: 'Sender Email',
      type: 'text',
      placeholder: 'hello@example.com',
      group: 'resend',
      tab: 'email',
    },

    // ─── Email / Cloudflare Email ────────────────────────────────────
    {
      name: 'cloudflare_email_api_token',
      title: 'API Token',
      type: 'password',
      placeholder: 'Bearer token with Email Send permission',
      group: 'cloudflare_email',
      tab: 'email',
    },
    {
      name: 'cloudflare_email_account_id',
      title: 'Account ID',
      type: 'text',
      placeholder: 'Cloudflare account ID',
      group: 'cloudflare_email',
      tab: 'email',
    },
    {
      name: 'cloudflare_email_sender_email',
      title: 'Sender Email',
      type: 'text',
      placeholder: 'hello@yourdomain.com',
      group: 'cloudflare_email',
      tab: 'email',
    },

    // ─── Storage / R2 ────────────────────────────────────────────────
    // Keys mirror the original ShipAny Two (`r2_*`) so existing DB config is read as-is.
    {
      name: 'r2_access_key',
      title: 'Cloudflare Access Key',
      type: 'text',
      placeholder: '',
      group: 'r2',
      tab: 'storage',
    },
    {
      name: 'r2_secret_key',
      title: 'Cloudflare Secret Key',
      type: 'password',
      placeholder: '',
      group: 'r2',
      tab: 'storage',
    },
    {
      name: 'r2_bucket_name',
      title: 'Bucket Name',
      type: 'text',
      placeholder: '',
      group: 'r2',
      tab: 'storage',
    },
    {
      name: 'r2_upload_path',
      title: 'Upload Path',
      type: 'text',
      placeholder: 'uploads',
      tip: 'Path to upload files to; leave empty to use the default. Example: uploads/foo/bar',
      group: 'r2',
      tab: 'storage',
    },
    {
      name: 'r2_endpoint',
      title: 'Endpoint',
      type: 'text',
      placeholder: 'https://<account-id>.r2.cloudflarestorage.com',
      tip: 'Leave empty to use the default R2 endpoint',
      group: 'r2',
      tab: 'storage',
    },
    {
      name: 'r2_domain',
      title: 'Domain',
      type: 'text',
      placeholder: 'https://cdn.example.com',
      group: 'r2',
      tab: 'storage',
    },

    // ─── AI / OpenAI ─────────────────────────────────────────────────
    {
      name: 'openai_base_url',
      title: 'Base URL',
      type: 'text',
      placeholder: 'https://api.openai.com/v1',
      group: 'openai',
      tab: 'ai',
    },
    {
      name: 'openai_api_key',
      title: 'API Key',
      type: 'password',
      placeholder: 'sk-xxx',
      group: 'openai',
      tab: 'ai',
    },

    // ─── AI / Anthropic ──────────────────────────────────────────────
    {
      name: 'anthropic_base_url',
      title: 'Base URL',
      type: 'text',
      placeholder: 'https://api.anthropic.com',
      group: 'anthropic',
      tab: 'ai',
    },
    {
      name: 'anthropic_api_key',
      title: 'API Key',
      type: 'password',
      placeholder: 'sk-ant-xxx',
      group: 'anthropic',
      tab: 'ai',
    },

    // ─── AI / Replicate ──────────────────────────────────────────────
    {
      name: 'replicate_api_token',
      title: 'API Token',
      type: 'password',
      placeholder: 'r8_xxx',
      group: 'replicate',
      tab: 'ai',
    },

    // ─── AI / Fal ────────────────────────────────────────────────────
    {
      name: 'fal_api_key',
      title: 'API Key',
      type: 'password',
      placeholder: 'xxx',
      group: 'fal',
      tab: 'ai',
    },

    // ─── AI / KIE ────────────────────────────────────────────────────
    {
      name: 'kie_api_key',
      title: 'API Key',
      type: 'password',
      placeholder: 'kie-xxx',
      group: 'kie',
      tab: 'ai',
    },

    // ─── Analytics / Google Analytics ────────────────────────────────
    {
      name: 'google_analytics_id',
      title: 'Measurement ID',
      type: 'text',
      placeholder: 'G-XXXXXXXXXX',
      group: 'google_analytics',
      tab: 'analytics',
    },

    // ─── Analytics / Plausible ───────────────────────────────────────
    {
      name: 'plausible_domain',
      title: 'Domain',
      type: 'text',
      placeholder: 'example.com',
      tip: 'Optional for the new site-specific script; required by legacy scripts',
      group: 'plausible',
      tab: 'analytics',
    },
    {
      name: 'plausible_src',
      title: 'Script Src',
      type: 'text',
      placeholder: 'https://plausible.example.com/js/pa-XXXXX.js',
      tip: 'Paste the complete site-specific script URL from Plausible, or leave blank to use the legacy cloud script',
      group: 'plausible',
      tab: 'analytics',
    },

    // ─── Ads / Google AdSense ────────────────────────────────────────
    {
      name: 'adsense_code',
      title: 'Publisher ID',
      type: 'text',
      placeholder: 'ca-pub-XXXXXXXXXXXXXXXX',
      tip: 'Your AdSense publisher ID — also used to generate /ads.txt',
      group: 'adsense',
      tab: 'ads',
    },

    // ─── Customer Service / Crisp ───────────────────────────────────
    {
      name: 'crisp_enabled',
      title: 'Enable Crisp',
      type: 'switch',
      group: 'crisp',
      tab: 'customer_service',
    },
    {
      name: 'crisp_website_id',
      title: 'Website ID',
      type: 'text',
      placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      group: 'crisp',
      tab: 'customer_service',
    },

    // ─── Customer Service / Tawk.to ─────────────────────────────────
    {
      name: 'tawk_enabled',
      title: 'Enable Tawk.to',
      type: 'switch',
      group: 'tawk',
      tab: 'customer_service',
    },
    {
      name: 'tawk_property_id',
      title: 'Property ID',
      type: 'text',
      placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxx',
      group: 'tawk',
      tab: 'customer_service',
    },
    {
      name: 'tawk_widget_id',
      title: 'Widget ID',
      type: 'text',
      placeholder: '1xxxxx/default',
      group: 'tawk',
      tab: 'customer_service',
    },
  ];
}
