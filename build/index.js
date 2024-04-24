import {createRequire} from "node:module";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __legacyDecorateClassTS = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1;i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __legacyMetadataTS = (k, v) => {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var __require = createRequire(import.meta.url);

// node_modules/dotenv/package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    name: "dotenv",
    version: "16.4.5",
    description: "Loads environment variables from .env file",
    main: "lib/main.js",
    types: "lib/main.d.ts",
    exports: {
      ".": {
        types: "./lib/main.d.ts",
        require: "./lib/main.js",
        default: "./lib/main.js"
      },
      "./config": "./config.js",
      "./config.js": "./config.js",
      "./lib/env-options": "./lib/env-options.js",
      "./lib/env-options.js": "./lib/env-options.js",
      "./lib/cli-options": "./lib/cli-options.js",
      "./lib/cli-options.js": "./lib/cli-options.js",
      "./package.json": "./package.json"
    },
    scripts: {
      "dts-check": "tsc --project tests/types/tsconfig.json",
      lint: "standard",
      "lint-readme": "standard-markdown",
      pretest: "npm run lint && npm run dts-check",
      test: "tap tests/*.js --100 -Rspec",
      "test:coverage": "tap --coverage-report=lcov",
      prerelease: "npm test",
      release: "standard-version"
    },
    repository: {
      type: "git",
      url: "git://github.com/motdotla/dotenv.git"
    },
    funding: "https://dotenvx.com",
    keywords: [
      "dotenv",
      "env",
      ".env",
      "environment",
      "variables",
      "config",
      "settings"
    ],
    readmeFilename: "README.md",
    license: "BSD-2-Clause",
    devDependencies: {
      "@definitelytyped/dtslint": "^0.0.133",
      "@types/node": "^18.11.3",
      decache: "^4.6.1",
      sinon: "^14.0.1",
      standard: "^17.0.0",
      "standard-markdown": "^7.1.0",
      "standard-version": "^9.5.0",
      tap: "^16.3.0",
      tar: "^6.1.11",
      typescript: "^4.8.4"
    },
    engines: {
      node: ">=12"
    },
    browser: {
      fs: false
    }
  };
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS((exports, module) => {
  var parse = function(src) {
    const obj = {};
    let lines = src.toString();
    lines = lines.replace(/\r\n?/mg, "\n");
    let match;
    while ((match = LINE.exec(lines)) != null) {
      const key = match[1];
      let value = match[2] || "";
      value = value.trim();
      const maybeQuote = value[0];
      value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
      if (maybeQuote === '"') {
        value = value.replace(/\\n/g, "\n");
        value = value.replace(/\\r/g, "\r");
      }
      obj[key] = value;
    }
    return obj;
  };
  var _parseVault = function(options) {
    const vaultPath = _vaultPath(options);
    const result = DotenvModule.configDotenv({ path: vaultPath });
    if (!result.parsed) {
      const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
      err.code = "MISSING_DATA";
      throw err;
    }
    const keys = _dotenvKey(options).split(",");
    const length = keys.length;
    let decrypted;
    for (let i = 0;i < length; i++) {
      try {
        const key = keys[i].trim();
        const attrs = _instructions(result, key);
        decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
        break;
      } catch (error) {
        if (i + 1 >= length) {
          throw error;
        }
      }
    }
    return DotenvModule.parse(decrypted);
  };
  var _log = function(message) {
    console.log(`[dotenv@${version}][INFO] ${message}`);
  };
  var _warn = function(message) {
    console.log(`[dotenv@${version}][WARN] ${message}`);
  };
  var _debug = function(message) {
    console.log(`[dotenv@${version}][DEBUG] ${message}`);
  };
  var _dotenvKey = function(options) {
    if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
      return options.DOTENV_KEY;
    }
    if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
      return process.env.DOTENV_KEY;
    }
    return "";
  };
  var _instructions = function(result, dotenvKey) {
    let uri;
    try {
      uri = new URL(dotenvKey);
    } catch (error) {
      if (error.code === "ERR_INVALID_URL") {
        const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      throw error;
    }
    const key = uri.password;
    if (!key) {
      const err = new Error("INVALID_DOTENV_KEY: Missing key part");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    const environment = uri.searchParams.get("environment");
    if (!environment) {
      const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
    const ciphertext = result.parsed[environmentKey];
    if (!ciphertext) {
      const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
      err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
      throw err;
    }
    return { ciphertext, key };
  };
  var _vaultPath = function(options) {
    let possibleVaultPath = null;
    if (options && options.path && options.path.length > 0) {
      if (Array.isArray(options.path)) {
        for (const filepath of options.path) {
          if (fs.existsSync(filepath)) {
            possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
          }
        }
      } else {
        possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
      }
    } else {
      possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
    }
    if (fs.existsSync(possibleVaultPath)) {
      return possibleVaultPath;
    }
    return null;
  };
  var _resolveHome = function(envPath) {
    return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
  };
  var _configVault = function(options) {
    _log("Loading env from encrypted .env.vault");
    const parsed = DotenvModule._parseVault(options);
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsed, options);
    return { parsed };
  };
  var configDotenv = function(options) {
    const dotenvPath = path.resolve(process.cwd(), ".env");
    let encoding = "utf8";
    const debug = Boolean(options && options.debug);
    if (options && options.encoding) {
      encoding = options.encoding;
    } else {
      if (debug) {
        _debug("No encoding is specified. UTF-8 is used by default");
      }
    }
    let optionPaths = [dotenvPath];
    if (options && options.path) {
      if (!Array.isArray(options.path)) {
        optionPaths = [_resolveHome(options.path)];
      } else {
        optionPaths = [];
        for (const filepath of options.path) {
          optionPaths.push(_resolveHome(filepath));
        }
      }
    }
    let lastError;
    const parsedAll = {};
    for (const path2 of optionPaths) {
      try {
        const parsed = DotenvModule.parse(fs.readFileSync(path2, { encoding }));
        DotenvModule.populate(parsedAll, parsed, options);
      } catch (e) {
        if (debug) {
          _debug(`Failed to load ${path2} ${e.message}`);
        }
        lastError = e;
      }
    }
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsedAll, options);
    if (lastError) {
      return { parsed: parsedAll, error: lastError };
    } else {
      return { parsed: parsedAll };
    }
  };
  var config = function(options) {
    if (_dotenvKey(options).length === 0) {
      return DotenvModule.configDotenv(options);
    }
    const vaultPath = _vaultPath(options);
    if (!vaultPath) {
      _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
      return DotenvModule.configDotenv(options);
    }
    return DotenvModule._configVault(options);
  };
  var decrypt = function(encrypted, keyStr) {
    const key = Buffer.from(keyStr.slice(-64), "hex");
    let ciphertext = Buffer.from(encrypted, "base64");
    const nonce = ciphertext.subarray(0, 12);
    const authTag = ciphertext.subarray(-16);
    ciphertext = ciphertext.subarray(12, -16);
    try {
      const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
      aesgcm.setAuthTag(authTag);
      return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
    } catch (error) {
      const isRange = error instanceof RangeError;
      const invalidKeyLength = error.message === "Invalid key length";
      const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
      if (isRange || invalidKeyLength) {
        const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      } else if (decryptionFailed) {
        const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
        err.code = "DECRYPTION_FAILED";
        throw err;
      } else {
        throw error;
      }
    }
  };
  var populate = function(processEnv, parsed, options = {}) {
    const debug = Boolean(options && options.debug);
    const override = Boolean(options && options.override);
    if (typeof parsed !== "object") {
      const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      err.code = "OBJECT_REQUIRED";
      throw err;
    }
    for (const key of Object.keys(parsed)) {
      if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
        if (override === true) {
          processEnv[key] = parsed[key];
        }
        if (debug) {
          if (override === true) {
            _debug(`"${key}" is already defined and WAS overwritten`);
          } else {
            _debug(`"${key}" is already defined and was NOT overwritten`);
          }
        }
      } else {
        processEnv[key] = parsed[key];
      }
    }
  };
  var fs = __require("fs");
  var path = __require("path");
  var os = __require("os");
  var crypto = __require("crypto");
  var packageJson = require_package();
  var version = packageJson.version;
  var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
  var DotenvModule = {
    configDotenv,
    _configVault,
    _parseVault,
    config,
    decrypt,
    parse,
    populate
  };
  exports.configDotenv = DotenvModule.configDotenv;
  exports._configVault = DotenvModule._configVault;
  exports._parseVault = DotenvModule._parseVault;
  exports.config = DotenvModule.config;
  exports.decrypt = DotenvModule.decrypt;
  exports.parse = DotenvModule.parse;
  exports.populate = DotenvModule.populate;
  module.exports = DotenvModule;
});

// node_modules/typedi/cjs/token.class.js
var require_token_class = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Token = undefined;

  class Token {
    constructor(name) {
      this.name = name;
    }
  }
  exports.Token = Token;
});

// node_modules/typedi/cjs/error/service-not-found.error.js
var require_service_not_found_error = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.ServiceNotFoundError = undefined;
  var token_class_1 = require_token_class();

  class ServiceNotFoundError extends Error {
    constructor(identifier) {
      var _a, _b;
      super();
      this.name = "ServiceNotFoundError";
      this.normalizedIdentifier = "<UNKNOWN_IDENTIFIER>";
      if (typeof identifier === "string") {
        this.normalizedIdentifier = identifier;
      } else if (identifier instanceof token_class_1.Token) {
        this.normalizedIdentifier = `Token<${identifier.name || "UNSET_NAME"}>`;
      } else if (identifier && (identifier.name || ((_a = identifier.prototype) === null || _a === undefined ? undefined : _a.name))) {
        this.normalizedIdentifier = `MaybeConstructable<${identifier.name}>` || `MaybeConstructable<${(_b = identifier.prototype) === null || _b === undefined ? undefined : _b.name}>`;
      }
    }
    get message() {
      return `Service with "${this.normalizedIdentifier}" identifier was not found in the container. ` + `Register it before usage via explicitly calling the "Container.set" function or using the "@Service()" decorator.`;
    }
  }
  exports.ServiceNotFoundError = ServiceNotFoundError;
});

// node_modules/typedi/cjs/error/cannot-instantiate-value.error.js
var require_cannot_instantiate_value_error = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.CannotInstantiateValueError = undefined;
  var token_class_1 = require_token_class();

  class CannotInstantiateValueError extends Error {
    constructor(identifier) {
      var _a, _b;
      super();
      this.name = "CannotInstantiateValueError";
      this.normalizedIdentifier = "<UNKNOWN_IDENTIFIER>";
      if (typeof identifier === "string") {
        this.normalizedIdentifier = identifier;
      } else if (identifier instanceof token_class_1.Token) {
        this.normalizedIdentifier = `Token<${identifier.name || "UNSET_NAME"}>`;
      } else if (identifier && (identifier.name || ((_a = identifier.prototype) === null || _a === undefined ? undefined : _a.name))) {
        this.normalizedIdentifier = `MaybeConstructable<${identifier.name}>` || `MaybeConstructable<${(_b = identifier.prototype) === null || _b === undefined ? undefined : _b.name}>`;
      }
    }
    get message() {
      return `Cannot instantiate the requested value for the "${this.normalizedIdentifier}" identifier. ` + `The related metadata doesn't contain a factory or a type to instantiate.`;
    }
  }
  exports.CannotInstantiateValueError = CannotInstantiateValueError;
});

// node_modules/typedi/cjs/empty.const.js
var require_empty_const = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.EMPTY_VALUE = undefined;
  exports.EMPTY_VALUE = Symbol("EMPTY_VALUE");
});

// node_modules/typedi/cjs/container-instance.class.js
var require_container_instance_class = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.ContainerInstance = undefined;
  var container_class_1 = require_container_class();
  var service_not_found_error_1 = require_service_not_found_error();
  var cannot_instantiate_value_error_1 = require_cannot_instantiate_value_error();
  var token_class_1 = require_token_class();
  var empty_const_1 = require_empty_const();

  class ContainerInstance {
    constructor(id) {
      this.services = [];
      this.id = id;
    }
    has(identifier) {
      return !!this.findService(identifier);
    }
    get(identifier) {
      const globalContainer = container_class_1.Container.of(undefined);
      const globalService = globalContainer.findService(identifier);
      const scopedService = this.findService(identifier);
      if (globalService && globalService.global === true)
        return this.getServiceValue(globalService);
      if (scopedService)
        return this.getServiceValue(scopedService);
      if (globalService && this !== globalContainer) {
        const clonedService = { ...globalService };
        clonedService.value = empty_const_1.EMPTY_VALUE;
        this.set(clonedService);
        const value = this.getServiceValue(clonedService);
        this.set({ ...clonedService, value });
        return value;
      }
      if (globalService)
        return this.getServiceValue(globalService);
      throw new service_not_found_error_1.ServiceNotFoundError(identifier);
    }
    getMany(identifier) {
      return this.findAllServices(identifier).map((service) => this.getServiceValue(service));
    }
    set(identifierOrServiceMetadata, value) {
      if (identifierOrServiceMetadata instanceof Array) {
        identifierOrServiceMetadata.forEach((data) => this.set(data));
        return this;
      }
      if (typeof identifierOrServiceMetadata === "string" || identifierOrServiceMetadata instanceof token_class_1.Token) {
        return this.set({
          id: identifierOrServiceMetadata,
          type: null,
          value,
          factory: undefined,
          global: false,
          multiple: false,
          eager: false,
          transient: false
        });
      }
      if (typeof identifierOrServiceMetadata === "function") {
        return this.set({
          id: identifierOrServiceMetadata,
          type: identifierOrServiceMetadata,
          value,
          factory: undefined,
          global: false,
          multiple: false,
          eager: false,
          transient: false
        });
      }
      const newService = {
        id: new token_class_1.Token("UNREACHABLE"),
        type: null,
        factory: undefined,
        value: empty_const_1.EMPTY_VALUE,
        global: false,
        multiple: false,
        eager: false,
        transient: false,
        ...identifierOrServiceMetadata
      };
      const service = this.findService(newService.id);
      if (service && service.multiple !== true) {
        Object.assign(service, newService);
      } else {
        this.services.push(newService);
      }
      if (newService.eager) {
        this.get(newService.id);
      }
      return this;
    }
    remove(identifierOrIdentifierArray) {
      if (Array.isArray(identifierOrIdentifierArray)) {
        identifierOrIdentifierArray.forEach((id) => this.remove(id));
      } else {
        this.services = this.services.filter((service) => {
          if (service.id === identifierOrIdentifierArray) {
            this.destroyServiceInstance(service);
            return false;
          }
          return true;
        });
      }
      return this;
    }
    reset(options = { strategy: "resetValue" }) {
      switch (options.strategy) {
        case "resetValue":
          this.services.forEach((service) => this.destroyServiceInstance(service));
          break;
        case "resetServices":
          this.services.forEach((service) => this.destroyServiceInstance(service));
          this.services = [];
          break;
        default:
          throw new Error("Received invalid reset strategy.");
      }
      return this;
    }
    findAllServices(identifier) {
      return this.services.filter((service) => service.id === identifier);
    }
    findService(identifier) {
      return this.services.find((service) => service.id === identifier);
    }
    getServiceValue(serviceMetadata) {
      var _a;
      let value = empty_const_1.EMPTY_VALUE;
      if (serviceMetadata.value !== empty_const_1.EMPTY_VALUE) {
        return serviceMetadata.value;
      }
      if (!serviceMetadata.factory && !serviceMetadata.type) {
        throw new cannot_instantiate_value_error_1.CannotInstantiateValueError(serviceMetadata.id);
      }
      if (serviceMetadata.factory) {
        if (serviceMetadata.factory instanceof Array) {
          let factoryInstance;
          try {
            factoryInstance = this.get(serviceMetadata.factory[0]);
          } catch (error) {
            if (error instanceof service_not_found_error_1.ServiceNotFoundError) {
              factoryInstance = new serviceMetadata.factory[0];
            } else {
              throw error;
            }
          }
          value = factoryInstance[serviceMetadata.factory[1]](this, serviceMetadata.id);
        } else {
          value = serviceMetadata.factory(this, serviceMetadata.id);
        }
      }
      if (!serviceMetadata.factory && serviceMetadata.type) {
        const constructableTargetType = serviceMetadata.type;
        const paramTypes = ((_a = Reflect) === null || _a === undefined ? undefined : _a.getMetadata("design:paramtypes", constructableTargetType)) || [];
        const params = this.initializeParams(constructableTargetType, paramTypes);
        params.push(this);
        value = new constructableTargetType(...params);
      }
      if (!serviceMetadata.transient && value !== empty_const_1.EMPTY_VALUE) {
        serviceMetadata.value = value;
      }
      if (value === empty_const_1.EMPTY_VALUE) {
        throw new cannot_instantiate_value_error_1.CannotInstantiateValueError(serviceMetadata.id);
      }
      if (serviceMetadata.type) {
        this.applyPropertyHandlers(serviceMetadata.type, value);
      }
      return value;
    }
    initializeParams(target, paramTypes) {
      return paramTypes.map((paramType, index) => {
        const paramHandler = container_class_1.Container.handlers.find((handler) => {
          return (handler.object === target || handler.object === Object.getPrototypeOf(target)) && handler.index === index;
        });
        if (paramHandler)
          return paramHandler.value(this);
        if (paramType && paramType.name && !this.isPrimitiveParamType(paramType.name)) {
          return this.get(paramType);
        }
        return;
      });
    }
    isPrimitiveParamType(paramTypeName) {
      return ["string", "boolean", "number", "object"].includes(paramTypeName.toLowerCase());
    }
    applyPropertyHandlers(target, instance) {
      container_class_1.Container.handlers.forEach((handler) => {
        if (typeof handler.index === "number")
          return;
        if (handler.object.constructor !== target && !(target.prototype instanceof handler.object.constructor))
          return;
        if (handler.propertyName) {
          instance[handler.propertyName] = handler.value(this);
        }
      });
    }
    destroyServiceInstance(serviceMetadata, force = false) {
      const shouldResetValue = force || !!serviceMetadata.type || !!serviceMetadata.factory;
      if (shouldResetValue) {
        if (typeof (serviceMetadata === null || serviceMetadata === undefined ? undefined : serviceMetadata.value)["destroy"] === "function") {
          try {
            serviceMetadata.value.destroy();
          } catch (error) {
          }
        }
        serviceMetadata.value = empty_const_1.EMPTY_VALUE;
      }
    }
  }
  exports.ContainerInstance = ContainerInstance;
});

// node_modules/typedi/cjs/container.class.js
var require_container_class = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Container = undefined;
  var container_instance_class_1 = require_container_instance_class();

  class Container {
    static of(containerId = "default") {
      if (containerId === "default")
        return this.globalInstance;
      let container = this.instances.find((instance) => instance.id === containerId);
      if (!container) {
        container = new container_instance_class_1.ContainerInstance(containerId);
        this.instances.push(container);
      }
      return container;
    }
    static has(identifier) {
      return this.globalInstance.has(identifier);
    }
    static get(identifier) {
      return this.globalInstance.get(identifier);
    }
    static getMany(id) {
      return this.globalInstance.getMany(id);
    }
    static set(identifierOrServiceMetadata, value) {
      this.globalInstance.set(identifierOrServiceMetadata, value);
      return this;
    }
    static remove(identifierOrIdentifierArray) {
      this.globalInstance.remove(identifierOrIdentifierArray);
      return this;
    }
    static reset(containerId = "default") {
      if (containerId == "default") {
        this.globalInstance.reset();
        this.instances.forEach((instance) => instance.reset());
      } else {
        const instance = this.instances.find((instance2) => instance2.id === containerId);
        if (instance) {
          instance.reset();
          this.instances.splice(this.instances.indexOf(instance), 1);
        }
      }
      return this;
    }
    static registerHandler(handler) {
      this.handlers.push(handler);
      return this;
    }
    static import(services) {
      return this;
    }
  }
  exports.Container = Container;
  Container.handlers = [];
  Container.globalInstance = new container_instance_class_1.ContainerInstance("default");
  Container.instances = [];
});

// node_modules/typedi/cjs/error/cannot-inject-value.error.js
var require_cannot_inject_value_error = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.CannotInjectValueError = undefined;

  class CannotInjectValueError extends Error {
    constructor(target, propertyName) {
      super();
      this.target = target;
      this.propertyName = propertyName;
      this.name = "CannotInjectValueError";
    }
    get message() {
      return `Cannot inject value into "${this.target.constructor.name}.${this.propertyName}". ` + `Please make sure you setup reflect-metadata properly and you don't use interfaces without service tokens as injection value.`;
    }
  }
  exports.CannotInjectValueError = CannotInjectValueError;
});

// node_modules/typedi/cjs/utils/resolve-to-type-wrapper.util.js
var require_resolve_to_type_wrapper_util = __commonJS((exports) => {
  var resolveToTypeWrapper = function(typeOrIdentifier, target, propertyName, index) {
    let typeWrapper;
    if (typeOrIdentifier && typeof typeOrIdentifier === "string" || typeOrIdentifier instanceof token_class_1.Token) {
      typeWrapper = { eagerType: typeOrIdentifier, lazyType: () => typeOrIdentifier };
    }
    if (typeOrIdentifier && typeof typeOrIdentifier === "function") {
      typeWrapper = { eagerType: null, lazyType: () => typeOrIdentifier() };
    }
    if (!typeOrIdentifier && propertyName) {
      const identifier = Reflect.getMetadata("design:type", target, propertyName);
      typeWrapper = { eagerType: identifier, lazyType: () => identifier };
    }
    if (!typeOrIdentifier && typeof index == "number" && Number.isInteger(index)) {
      const paramTypes = Reflect.getMetadata("design:paramtypes", target, propertyName);
      const identifier = paramTypes === null || paramTypes === undefined ? undefined : paramTypes[index];
      typeWrapper = { eagerType: identifier, lazyType: () => identifier };
    }
    return typeWrapper;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.resolveToTypeWrapper = undefined;
  var token_class_1 = require_token_class();
  exports.resolveToTypeWrapper = resolveToTypeWrapper;
});

// node_modules/typedi/cjs/decorators/inject-many.decorator.js
var require_inject_many_decorator = __commonJS((exports) => {
  var InjectMany = function(typeOrIdentifier) {
    return function(target, propertyName, index) {
      const typeWrapper = resolve_to_type_wrapper_util_1.resolveToTypeWrapper(typeOrIdentifier, target, propertyName, index);
      if (typeWrapper === undefined || typeWrapper.eagerType === undefined || typeWrapper.eagerType === Object) {
        throw new cannot_inject_value_error_1.CannotInjectValueError(target, propertyName);
      }
      container_class_1.Container.registerHandler({
        object: target,
        propertyName,
        index,
        value: (containerInstance) => {
          const evaluatedLazyType = typeWrapper.lazyType();
          if (evaluatedLazyType === undefined || evaluatedLazyType === Object) {
            throw new cannot_inject_value_error_1.CannotInjectValueError(target, propertyName);
          }
          return containerInstance.getMany(evaluatedLazyType);
        }
      });
    };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.InjectMany = undefined;
  var container_class_1 = require_container_class();
  var cannot_inject_value_error_1 = require_cannot_inject_value_error();
  var resolve_to_type_wrapper_util_1 = require_resolve_to_type_wrapper_util();
  exports.InjectMany = InjectMany;
});

// node_modules/typedi/cjs/decorators/inject.decorator.js
var require_inject_decorator = __commonJS((exports) => {
  var Inject = function(typeOrIdentifier) {
    return function(target, propertyName, index) {
      const typeWrapper = resolve_to_type_wrapper_util_1.resolveToTypeWrapper(typeOrIdentifier, target, propertyName, index);
      if (typeWrapper === undefined || typeWrapper.eagerType === undefined || typeWrapper.eagerType === Object) {
        throw new cannot_inject_value_error_1.CannotInjectValueError(target, propertyName);
      }
      container_class_1.Container.registerHandler({
        object: target,
        propertyName,
        index,
        value: (containerInstance) => {
          const evaluatedLazyType = typeWrapper.lazyType();
          if (evaluatedLazyType === undefined || evaluatedLazyType === Object) {
            throw new cannot_inject_value_error_1.CannotInjectValueError(target, propertyName);
          }
          return containerInstance.get(evaluatedLazyType);
        }
      });
    };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Inject = undefined;
  var container_class_1 = require_container_class();
  var cannot_inject_value_error_1 = require_cannot_inject_value_error();
  var resolve_to_type_wrapper_util_1 = require_resolve_to_type_wrapper_util();
  exports.Inject = Inject;
});

// node_modules/typedi/cjs/decorators/service.decorator.js
var require_service_decorator = __commonJS((exports) => {
  var Service = function(optionsOrServiceIdentifier) {
    return (targetConstructor) => {
      const serviceMetadata = {
        id: targetConstructor,
        type: targetConstructor,
        factory: undefined,
        multiple: false,
        global: false,
        eager: false,
        transient: false,
        value: empty_const_1.EMPTY_VALUE
      };
      if (optionsOrServiceIdentifier instanceof token_class_1.Token || typeof optionsOrServiceIdentifier === "string") {
        serviceMetadata.id = optionsOrServiceIdentifier;
      } else if (optionsOrServiceIdentifier) {
        serviceMetadata.id = optionsOrServiceIdentifier.id || targetConstructor;
        serviceMetadata.factory = optionsOrServiceIdentifier.factory || undefined;
        serviceMetadata.multiple = optionsOrServiceIdentifier.multiple || false;
        serviceMetadata.global = optionsOrServiceIdentifier.global || false;
        serviceMetadata.eager = optionsOrServiceIdentifier.eager || false;
        serviceMetadata.transient = optionsOrServiceIdentifier.transient || false;
      }
      container_class_1.Container.set(serviceMetadata);
    };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Service = undefined;
  var container_class_1 = require_container_class();
  var token_class_1 = require_token_class();
  var empty_const_1 = require_empty_const();
  exports.Service = Service;
});

// node_modules/typedi/cjs/index.js
var require_cjs = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() {
      return m[k];
    } });
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = exports && exports.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Token = exports.Container = exports.ContainerInstance = undefined;
  var container_class_1 = require_container_class();
  __exportStar(require_inject_many_decorator(), exports);
  __exportStar(require_inject_decorator(), exports);
  __exportStar(require_service_decorator(), exports);
  __exportStar(require_cannot_inject_value_error(), exports);
  __exportStar(require_cannot_instantiate_value_error(), exports);
  __exportStar(require_service_not_found_error(), exports);
  var container_instance_class_1 = require_container_instance_class();
  Object.defineProperty(exports, "ContainerInstance", { enumerable: true, get: function() {
    return container_instance_class_1.ContainerInstance;
  } });
  var container_class_2 = require_container_class();
  Object.defineProperty(exports, "Container", { enumerable: true, get: function() {
    return container_class_2.Container;
  } });
  var token_class_1 = require_token_class();
  Object.defineProperty(exports, "Token", { enumerable: true, get: function() {
    return token_class_1.Token;
  } });
  exports.default = container_class_1.Container;
});

// index.ts
var import_dotenv = __toESM(require_main(), 1);

// facades/System.ts
import {exit} from "node:process";

// core/Listener.ts
var import_typedi2 = __toESM(require_cjs(), 1);

// core/Multicast.ts
var import_typedi = __toESM(require_cjs(), 1);
import dgram, {Socket} from "node:dgram";

// core/Network.ts
import {networkInterfaces} from "os";

class Network {
  getInterfaces() {
    const interfaces = Object.keys(networkInterfaces()).filter((name) => name !== "lo");
    return interfaces;
  }
  getIpv4Info(name) {
    return this.getIpInfo("IPv4", name);
  }
  getIpv6Info(name) {
    return this.getIpInfo("IPv6", name);
  }
  getIpInfo(family, name) {
    const interfaceByName = networkInterfaces()[name];
    if (Array.isArray(interfaceByName) && interfaceByName.length > 0) {
      return interfaceByName.filter((value) => value.family === family)[0];
    }
    return null;
  }
}

// core/Multicast.ts
class Multicast {
  useInterface;
  udpClient;
  multicastAddress;
  port;
  static instance;
  constructor(useInterface, udpClient = null, multicastAddress = "127.0.0.1", port = 5000) {
    this.useInterface = useInterface;
    this.udpClient = udpClient;
    this.multicastAddress = multicastAddress;
    this.port = port;
  }
  static createServer(multicastAddress = "127.0.0.1", port = 5000) {
    if (Multicast.instance) {
      return Multicast.instance;
    }
    const interfaces = new Network().getInterfaces();
    const useInterface = interfaces.length > 0 ? interfaces[0] : "lo";
    const udpClient = dgram.createSocket({ type: "udp4", reuseAddr: true });
    udpClient?.bind(port, () => {
      try {
        udpClient?.addMembership(multicastAddress);
      } catch (error) {
        console.log(error);
        multicastAddress = "127.0.0.1";
        port = 5000;
        console.error("Impossible to join the multicast group, listening on ", multicastAddress + ":" + port);
      }
    });
    Multicast.instance = new Multicast(useInterface, udpClient, multicastAddress, port);
    Multicast.instance.multicastAddress = multicastAddress;
    Multicast.instance.port = port;
    return Multicast.instance;
  }
  static getConnexion() {
    return Multicast.instance;
  }
  getUseInterface() {
    return this.useInterface;
  }
  getSocket() {
    return this.udpClient;
  }
  getAddress() {
    return this.multicastAddress;
  }
  getPort() {
    return this.port;
  }
}
Multicast = __legacyDecorateClassTS([
  import_typedi.Service(),
  __legacyMetadataTS("design:paramtypes", [
    String,
    typeof Socket === "undefined" ? Object : Socket,
    String,
    Number
  ])
], Multicast);

// core/Listener.ts
class Listener {
  server;
  constructor(server) {
    this.server = server;
  }
  listen(callback) {
    this.server.getSocket()?.on("listening", () => {
      this.server.getSocket()?.on("message", (msgBuffer, rinfo) => {
        const message = JSON.parse(msgBuffer.toString());
        callback(message, rinfo, this.server.getSocket());
      });
    });
  }
}
Listener = __legacyDecorateClassTS([
  import_typedi2.Service(),
  __legacyMetadataTS("design:paramtypes", [
    typeof Multicast === "undefined" ? Object : Multicast
  ])
], Listener);

// core/Request.ts
var import_typedi3 = __toESM(require_cjs(), 1);
import {Socket as Socket2} from "node:dgram";
class Request {
  socket;
  constructor(socket) {
    this.socket = socket;
  }
  send(address = "127.0.0.1", port, message) {
    const messageBuffer = Buffer.from(JSON.stringify(message));
    this.socket.send(messageBuffer, 0, messageBuffer.length, port, address);
  }
}
Request = __legacyDecorateClassTS([
  import_typedi3.Service(),
  __legacyMetadataTS("design:paramtypes", [
    typeof Socket2 === "undefined" ? Object : Socket2
  ])
], Request);

// event/MulticastEvent.ts
class MulticastEvent {
  routerEvent;
  listener;
  constructor(routerEvent, listener) {
    this.routerEvent = routerEvent;
    this.listener = listener;
  }
  listen(callback) {
    try {
      this.listener.listen((message, rinfo, socket) => {
        const data = { ...message, rinfo, socket };
        this.routerEvent.triggerEvent(message.label, data);
      });
      callback(null);
    } catch (error) {
      callback(new Error("unkown error"));
    }
  }
  stop() {
    console.log("Stoped!!!");
  }
}

// services/database/DataManager.ts
var import_typedi5 = __toESM(require_cjs(), 1);

// services/fileSystem/LocalService.ts
var import_typedi4 = __toESM(require_cjs(), 1);
import fs from "fs";
class LocalService {
  filePath;
  constructor(filePath = process.env.DATABASE_PATH) {
    this.filePath = filePath;
  }
  getFilePath() {
    return this.filePath;
  }
  read() {
    const fileContent = fs.readFileSync(this.filePath);
    return fileContent.toString();
  }
  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  }
  delete() {
    fs.rmSync(this.filePath);
  }
}
LocalService = __legacyDecorateClassTS([
  import_typedi4.Service(),
  __legacyMetadataTS("design:paramtypes", [
    String
  ])
], LocalService);

// services/database/DataManager.ts
class DataManager {
  fileSystem;
  constructor(fileSystem) {
    this.fileSystem = fileSystem;
  }
  create(data) {
    let dataList = this.getAllData();
    const tablename = data.getEntityName();
    if (!dataList[tablename]) {
      dataList[tablename] = [];
    }
    data.setslug();
    dataList[tablename].push(data);
    this.fileSystem.write(dataList);
  }
  update(slug, newData) {
    const dataList = this.getAllData();
    const tablename = newData.getEntityName();
    if (Array.isArray(dataList[tablename]) && 0 < dataList[tablename].length) {
      const data = dataList[tablename];
      for (let i = 0;i < data.length; i++) {
        if (data[i].slug === slug) {
          dataList[tablename][i] = newData;
          break;
        }
      }
      this.fileSystem.write(dataList);
      return newData;
    }
    return newData;
  }
  delete(index, data) {
    const dataList = this.getAllData();
    const tablename = data.getEntityName();
    if (Array.isArray(dataList[tablename]) && index >= 0 && index < dataList[tablename].length) {
      dataList[tablename].splice(index, 1);
      this.fileSystem.write(dataList);
      return true;
    } else {
      return false;
    }
  }
  getAllData() {
    try {
      const jsonData = this.fileSystem.read();
      return JSON.parse(jsonData);
    } catch (error) {
      this.fileSystem.write({});
      return {};
    }
  }
}
DataManager = __legacyDecorateClassTS([
  import_typedi5.Service(),
  __legacyMetadataTS("design:paramtypes", [
    typeof LocalService === "undefined" ? Object : LocalService
  ])
], DataManager);

// services/database/DataRepository.ts
class DataRepository {
  fileSystem;
  constructor(fileSystem) {
    this.fileSystem = fileSystem;
  }
  getAllData(table) {
    const tablename = table.getEntityName();
    try {
      const jsonData = this.fileSystem.read();
      const databaseData = JSON.parse(jsonData);
      if (!Array.isArray(databaseData[tablename])) {
        const newTable = { [tablename]: [] };
        this.fileSystem.write(newTable);
        return this.createDTO(table, databaseData[tablename]);
      }
      return this.createDTO(table, databaseData[tablename]);
    } catch (error) {
      const newTable = { [tablename]: [] };
      this.fileSystem.write(newTable);
      return this.createDTO(table, newTable[tablename]);
    }
  }
  getBySlug(slug, table) {
    const tablename = table.getEntityName();
    const allData = this.getAllData(table);
    const data = allData.filter((value) => value.getslug() === slug);
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    } else {
      return null;
    }
  }
  getDataByIndex(index, table) {
    const tablename = table.getEntityName();
    const allData = this.getAllData(table);
    if (index >= 0 && index < allData.length) {
      return allData[index];
    } else {
      return null;
    }
  }
  createDTO(table, data) {
    let dtos = [];
    data.forEach(function(value) {
      const tempTable = table.create();
      const dto = tempTable.set(value);
      dtos.push(dto);
    });
    return dtos;
  }
}

// core/Database.ts
class Database {
  static getManager() {
    const fileSystem = new LocalService;
    const manager = new DataManager(fileSystem);
    return manager;
  }
  static getRepository() {
    const fileSystem = new LocalService;
    const repository = new DataRepository(fileSystem);
    return repository;
  }
}

// core/Entity.ts
import {randomBytes} from "crypto";

class Entity {
  slug = "";
  getslug() {
    return this.slug;
  }
  setslug() {
    this.slug = this.generateHash();
    return this;
  }
  generateHash() {
    const randomize = randomBytes(16);
    const hash = randomize.toString("hex");
    return hash;
  }
  getMethods() {
  }
}

// entity/Idenity.ts
class Idenity extends Entity {
  constructor() {
    super(...arguments);
  }
  name = null;
  physicalAddress = null;
  ipv4 = null;
  getname = () => {
    return this.name;
  };
  setname = (name) => {
    this.name = name;
    return this;
  };
  getphysicalAddress = () => {
    return this.physicalAddress;
  };
  setphysicalAddress = (physicalAddress) => {
    this.physicalAddress = physicalAddress;
    return this;
  };
  getipv4 = () => {
    return this.ipv4;
  };
  setipv4 = (ipv4) => {
    this.ipv4 = ipv4;
    return this;
  };
  set(entries) {
    this.slug = entries.slug;
    this.name = entries.name, this.physicalAddress = entries.physicalAddress;
    this.ipv4 = entries.ipv4;
    return this;
  }
  getEntityName() {
    return "identity";
  }
  create() {
    return new Idenity;
  }
}

// facades/Idenity.ts
class IdentityFacade {
  repository = Database.getRepository();
  manager = Database.getManager();
  get() {
    let identity = new Idenity;
    identity = this.repository.getDataByIndex(0, identity);
    return identity;
  }
  update(name) {
    let identity = this.get();
    if (identity) {
      identity.setname(name);
      this.manager.update(identity.getslug(), identity);
      return identity;
    }
    return null;
  }
}

// entity/Search.ts
class Search extends Entity {
  constructor() {
    super(...arguments);
  }
  name = null;
  content = [];
  status = "requesting";
  searcher = null;
  founders = [];
  getname = () => {
    return this.name;
  };
  setname = (name) => {
    this.name = name;
    return this;
  };
  getcontent = () => {
    return this.content;
  };
  addcontent = (content) => {
    this.content.push(content);
    return this;
  };
  setcontent = (contents) => {
    this.content = contents;
    return this;
  };
  getstatus = () => {
    return this.status;
  };
  setstatus = (status) => {
    this.status = status;
    return this;
  };
  getsearcher() {
    return this.searcher;
  }
  setsearcher(searcher) {
    this.searcher = searcher;
    return this;
  }
  getfounders = () => {
    return this.founders;
  };
  addfounders = (founder) => {
    const existing = this.founders.filter((value) => value.getslug() === founder.getslug());
    if (existing.length === 0) {
      this.founders.push(founder);
    }
    return this;
  };
  setfounders = (founders) => {
    this.founders = founders;
    return this;
  };
  set(entries) {
    this.slug = entries.slug;
    this.name = entries.name, this.content = entries.content;
    this.status = entries.status;
    this.searcher = new Idenity;
    this.searcher.set(entries.searcher);
    this.founders = entries.founders.map((entry) => new Idenity().set(entry));
    return this;
  }
  getEntityName() {
    return "search";
  }
  create() {
    return new Search;
  }
}

// controllers/SearchController.ts
class SearchController {
  search(body) {
    const searchBody = body.data;
    const identity = new IdentityFacade().get();
    const request = new Request(body.socket);
    const remoteAddress = body.rinfo.address;
    const remotePort = body.rinfo.port;
    request.send(remoteAddress, remotePort, { label: "/found", data: { identity, search: searchBody } });
  }
  found(body) {
    const manager = Database.getManager();
    const repository = Database.getRepository();
    const slug = body.data.search.slug;
    const identity = new Idenity().set(body.data.identity);
    const search = repository.getBySlug(slug, new Search);
    search?.addfounders(identity);
    manager.update(slug, search);
    console.log("Search name:", search?.getslug(), "found by:", identity.getname());
  }
}

// controllers/SystemController.ts
class SystemController {
  init() {
    console.log("Hello world from controller");
  }
}

// event/RouterEvent.ts
var import_typedi6 = __toESM(require_cjs(), 1);
class EventRouter {
  routes = [];
  addRoute(eventName, controller) {
    this.routes.push({ eventName, controller });
  }
  removeRoute(eventName) {
    this.routes = this.routes.filter((route) => route.eventName !== eventName);
  }
  triggerEvent(eventName, ...args) {
    const route = this.routes.find((route2) => route2.eventName === eventName);
    if (route) {
      route.controller(...args);
    } else {
      console.warn(`No controller found for event '${eventName}'`);
    }
  }
}
EventRouter = __legacyDecorateClassTS([
  import_typedi6.Service()
], EventRouter);

// eventRouters/router.ts
var router = new EventRouter;
var { init } = new SystemController;
var { search, found } = new SearchController;
router.addRoute("/hello-world", init);
router.addRoute("/search", search);
router.addRoute("/found", found);

// services/identity/IdenityService.ts
class IdentityService {
  init(server) {
    const repository = Database.getRepository();
    const networkInfo = new Network().getIpv4Info(server.getUseInterface());
    let identity = new Idenity;
    identity = repository.getDataByIndex(0, identity);
    if (!identity && networkInfo) {
      const manager = Database.getManager();
      identity = new Idenity;
      identity.setname(networkInfo?.address).setphysicalAddress(networkInfo.mac).setipv4(networkInfo.address);
      manager.create(identity);
    }
  }
}

// facades/System.ts
class System {
  multicastAddress;
  multicastport;
  constructor() {
    this.multicastAddress = process.env.MULTICAST_ADDRESS;
    this.multicastport = parseInt(process.env.MULTICAST_PORT || "");
  }
  init() {
    const server = this.startServer();
    const identitySerice = new IdentityService;
    identitySerice.init(server);
  }
  stop() {
    exit(0);
  }
  startServer() {
    const server = Multicast.createServer(this.multicastAddress, this.multicastport);
    const socket = server.getSocket();
    if (socket) {
      const request = new Request(socket);
      request.send(this.multicastAddress, this.multicastport, { label: "/hello-world", data: "hello world" });
    }
    const listener = new Listener(server);
    const event = new MulticastEvent(router, listener);
    event.listen((error) => {
      if (error)
        throw error;
      console.log(`listening on [${server.getUseInterface()}]`);
    });
    return server;
  }
}

// facades/Search.ts
import {randomBytes as randomBytes2} from "crypto";

class SearchFacade {
  manager = Database.getManager();
  repository = Database.getRepository();
  create(searchBody) {
    const newSearch = new Search;
    const identity = new IdentityFacade().get();
    const slug = this.generateHash().toString();
    newSearch.setname(searchBody.name).setcontent(searchBody.content).setstatus("requesting").setsearcher(identity);
    this.manager.create(newSearch);
    this.makeRequest(newSearch);
  }
  resend() {
    const searchs = this.getAll();
    const current = this;
    searchs.forEach((search2) => {
      current.makeRequest(search2);
    });
  }
  getAll() {
    const search2 = new Search;
    const searchs = this.repository.getAllData(search2);
    return searchs;
  }
  getByStatus(status) {
    const searchs = this.getAll().filter((value) => value.getstatus() === status);
    return searchs;
  }
  changeStatus(slug, status) {
    let search2 = new Search;
    search2 = this.repository.getBySlug(slug, search2);
    if (search2) {
      search2.setstatus(status);
      return this.manager.update(slug, search2);
    }
    return null;
  }
  delete(index) {
    const search2 = new Search;
    this.manager.delete(index, search2);
  }
  makeRequest(newSearch) {
    const server = Multicast.getConnexion();
    const socket = server.getSocket();
    if (socket) {
      const request = new Request(socket);
      request.send(server.getAddress(), server.getPort(), { label: "/search", data: newSearch });
    }
  }
  generateHash() {
    const randomize = randomBytes2(16);
    const hash = randomize.toString("hex");
    return hash;
  }
}

// entity/Chat.ts
class Chat extends Entity {
  constructor() {
    super(...arguments);
  }
  name = null;
  user = null;
  discussion = [];
  status = "disabled";
  getname = () => {
    return this.name;
  };
  setname = (name) => {
    this.name = name;
    return this;
  };
  getuser = () => {
    return this.user;
  };
  setuser = (user) => {
    this.user = user;
    return this;
  };
  getdiscussion = () => {
    return this.discussion;
  };
  adddiscussion = (discussion) => {
    this.discussion.push(discussion);
    return this;
  };
  setdiscussion = (discussions) => {
    this.discussion = discussions;
    return this;
  };
  getstatus = () => {
    return this.status;
  };
  setstatus = (status) => {
    this.status = status;
    return this;
  };
  set(entries) {
    this.slug = entries.slug;
    console.log("entries", entries.user);
    this.user = new Idenity;
    this.user = this.user.set(entries.user);
    this.name = entries.name, this.discussion = entries.discussion.map((entry) => {
      return { ...entry, user: new Idenity().set(entry.user) };
    });
    this.status = entries.status;
    return this;
  }
  getEntityName() {
    return "chat";
  }
  create() {
    return new Chat;
  }
}

// facades/Chat.ts
class ChatFacade {
  repository = Database.getRepository();
  manager = Database.getManager();
  new(user_id, message = "", name = null) {
    const currentUser = new IdentityFacade().get();
    const user = this.repository.getBySlug(user_id, new Idenity);
    if (!user) {
      throw "User not found";
    }
    const newChat = new Chat;
    newChat.setname(name || user.getname()).setuser(user).adddiscussion({ user: currentUser, content: [message] }).setstatus("active");
    this.manager.create(newChat);
    this.makeRequest(newChat, user.getipv4());
    console.log("hererererere");
  }
  makeRequest(newChat, address) {
    const server = Multicast.getConnexion();
    const socket = server.getSocket();
    if (socket) {
      const request = new Request(socket);
      request.send(address || server.getAddress(), server.getPort(), { label: "/chat", data: newChat });
    }
  }
}

// index.ts
import_dotenv.config();
var system = new System;
var search2 = new SearchFacade;
var identity = new IdentityFacade;
var network = new Network;
var chat = new ChatFacade;
system.init();
identity.update("Nomena Fitiavana");
search2.create({ name: "Test", content: [] });
search2.resend();
