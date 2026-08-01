import { z } from 'zod'; // 用来定义数据的

export const DEFAULT_APP_PORT = 3001; // 默认端口
export const DEFAULT_LOGGING_LEVEL = 'log'; // 默认日志级别
export const DEFAULT_CORS_ALLOWED_ORIGIN = '*'; // 默认请求来源于明
export const DEFAULT_JWT_SECRET = 'your-secret-key'; // JWT密钥
export const DEFAULT_JWT_EXPIRES_IN = '1h'; // 密钥过期时间
export const DEFAULT_DB_HOST = 'localhost'; // 数据库主机
export const DEFAULT_DB_PORT = 5432; // 数据库端口
export const DEFAULT_DB_USER = 'nestuser'; // 数据库用户
export const DEFAULT_DB_PASS = 'nestpassword'; // 数据库密码
export const DEFAULT_DB_DATABASE = 'nestdb'; // 默认数据库
export const DEFAULT_DB_LOGGING = false; // 默认数据库日志

// 下面这里是定义schema（规则）
const configSchema = z.object({
  APP_VERSION: z.string().optional(), // APP版本，是可选的字符串
  APP_PORT: z.coerce.number().min(1).max(65535).default(DEFAULT_APP_PORT), // APP端口号，强制转换成数字，最小1，最大65535，并指定默认值
  LOGGING_LEVEL: z.enum(['verbose', 'debug', 'log', 'warn', 'error', 'fatal']).default(DEFAULT_LOGGING_LEVEL), // 枚举类型，并指定默认值
  CORS_ALLOWED_ORIGIN: z // 跨域的参数
    .string() // 必须是字符串
    .default(DEFAULT_CORS_ALLOWED_ORIGIN)
    .transform((val) => {
      // 如果验证通过，那么转换这个值
      // Handle comma-separated values by splitting and trimming 使用逗号分隔字符，并且去空格
      if (val === '*') return '*';
      return val
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0);
    }),
  JWT_SECRET: z.string().min(1).default(DEFAULT_JWT_SECRET), // JWT密钥，必须是字符串并且最小值是1，并指定默认值
  JWT_EXPIRES_IN: z.string().min(1).default(DEFAULT_JWT_EXPIRES_IN), // 过期时间，最小1， 并指定默认值
  DB_HOST: z.string().default(DEFAULT_DB_HOST),
  DB_PORT: z.coerce.number().min(1).max(65535).default(DEFAULT_DB_PORT),
  DB_USER: z.string().default(DEFAULT_DB_USER),
  DB_PASS: z.string().default(DEFAULT_DB_PASS),
  DB_DATABASE: z.string().default(DEFAULT_DB_DATABASE),
  DB_HOST_READ_ONLY: z.string().optional(),
  DB_MIGRATIONS_RUN: z.preprocess((val) => {
    // 在数据验证之前对数据进行预处理，将数据转成boolean
    if (typeof val === 'string') {
      if (val.toLowerCase() === 'false' || val === '0') return false;
      if (val.toLowerCase() === 'true' || val === '1') return true;
    }
    return val;
  }, z.boolean().default(true)),
  DB_SSL: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val.toLowerCase() === 'false' || val === '0') return false;
      if (val.toLowerCase() === 'true' || val === '1') return true;
    }
    return val;
  }, z.boolean().default(true)),
  DB_LOGGING: z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val.toLowerCase() === 'false' || val === '0') return false;
      if (val.toLowerCase() === 'true' || val === '1') return true;
    }
    return val;
  }, z.boolean().default(DEFAULT_DB_LOGGING)),
  SCHEDULE_TASK_CLEANUP_CRON: z.string().optional(),
});

// 这行代码的意思是，从configSchema提取类型定义，然后就可以const config:Config这样子使用了
export type Config = z.infer<typeof configSchema>;

/**
 * Record是创建一个对象类型，键是string，值是unknown，等价于：
 * infterface Config {
 *  [key: string]: unknow
 * }
 */
export const validate = (config: Record<string, unknown>): Config => {
  const result = configSchema.safeParse(config); // 验证这个参数是否符合上文中创建的规则

  // 如果不符合规则，那么抛出错误
  if (!result.success) {
    const message = result.error.issues.map((issue) => `${issue.path.join('.')} - ${issue.message}`).join(', ');
    throw new Error(`Config validation error: ${message}`);
  }

  return result.data;
};
