import {createRequire} from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
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
var __require = /* @__PURE__ */ createRequire(import.meta.url);

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
  function parse(src) {
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
  }
  function _parseVault(options) {
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
  }
  function _log(message) {
    console.log(`[dotenv@${version}][INFO] ${message}`);
  }
  function _warn(message) {
    console.log(`[dotenv@${version}][WARN] ${message}`);
  }
  function _debug(message) {
    console.log(`[dotenv@${version}][DEBUG] ${message}`);
  }
  function _dotenvKey(options) {
    if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
      return options.DOTENV_KEY;
    }
    if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
      return process.env.DOTENV_KEY;
    }
    return "";
  }
  function _instructions(result, dotenvKey) {
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
  }
  function _vaultPath(options) {
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
  }
  function _resolveHome(envPath) {
    return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
  }
  function _configVault(options) {
    _log("Loading env from encrypted .env.vault");
    const parsed = DotenvModule._parseVault(options);
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsed, options);
    return { parsed };
  }
  function configDotenv(options) {
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
  }
  function config(options) {
    if (_dotenvKey(options).length === 0) {
      return DotenvModule.configDotenv(options);
    }
    const vaultPath = _vaultPath(options);
    if (!vaultPath) {
      _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
      return DotenvModule.configDotenv(options);
    }
    return DotenvModule._configVault(options);
  }
  function decrypt(encrypted, keyStr) {
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
  }
  function populate(processEnv, parsed, options = {}) {
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
  }
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
  function resolveToTypeWrapper(typeOrIdentifier, target, propertyName, index) {
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
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.resolveToTypeWrapper = undefined;
  var token_class_1 = require_token_class();
  exports.resolveToTypeWrapper = resolveToTypeWrapper;
});

// node_modules/typedi/cjs/decorators/inject-many.decorator.js
var require_inject_many_decorator = __commonJS((exports) => {
  function InjectMany(typeOrIdentifier) {
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
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.InjectMany = undefined;
  var container_class_1 = require_container_class();
  var cannot_inject_value_error_1 = require_cannot_inject_value_error();
  var resolve_to_type_wrapper_util_1 = require_resolve_to_type_wrapper_util();
  exports.InjectMany = InjectMany;
});

// node_modules/typedi/cjs/decorators/inject.decorator.js
var require_inject_decorator = __commonJS((exports) => {
  function Inject(typeOrIdentifier) {
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
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Inject = undefined;
  var container_class_1 = require_container_class();
  var cannot_inject_value_error_1 = require_cannot_inject_value_error();
  var resolve_to_type_wrapper_util_1 = require_resolve_to_type_wrapper_util();
  exports.Inject = Inject;
});

// node_modules/typedi/cjs/decorators/service.decorator.js
var require_service_decorator = __commonJS((exports) => {
  function Service(optionsOrServiceIdentifier) {
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
  }
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

// node_modules/color-name/index.js
var require_color_name = __commonJS((exports, module) => {
  module.exports = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50]
  };
});

// node_modules/color-convert/conversions.js
var require_conversions = __commonJS((exports, module) => {
  function comparativeDistance(x, y) {
    return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
  }
  var cssKeywords = require_color_name();
  var reverseKeywords = {};
  for (const key of Object.keys(cssKeywords)) {
    reverseKeywords[cssKeywords[key]] = key;
  }
  var convert = {
    rgb: { channels: 3, labels: "rgb" },
    hsl: { channels: 3, labels: "hsl" },
    hsv: { channels: 3, labels: "hsv" },
    hwb: { channels: 3, labels: "hwb" },
    cmyk: { channels: 4, labels: "cmyk" },
    xyz: { channels: 3, labels: "xyz" },
    lab: { channels: 3, labels: "lab" },
    lch: { channels: 3, labels: "lch" },
    hex: { channels: 1, labels: ["hex"] },
    keyword: { channels: 1, labels: ["keyword"] },
    ansi16: { channels: 1, labels: ["ansi16"] },
    ansi256: { channels: 1, labels: ["ansi256"] },
    hcg: { channels: 3, labels: ["h", "c", "g"] },
    apple: { channels: 3, labels: ["r16", "g16", "b16"] },
    gray: { channels: 1, labels: ["gray"] }
  };
  module.exports = convert;
  for (const model of Object.keys(convert)) {
    if (!("channels" in convert[model])) {
      throw new Error("missing channels property: " + model);
    }
    if (!("labels" in convert[model])) {
      throw new Error("missing channel labels property: " + model);
    }
    if (convert[model].labels.length !== convert[model].channels) {
      throw new Error("channel and label counts mismatch: " + model);
    }
    const { channels, labels } = convert[model];
    delete convert[model].channels;
    delete convert[model].labels;
    Object.defineProperty(convert[model], "channels", { value: channels });
    Object.defineProperty(convert[model], "labels", { value: labels });
  }
  convert.rgb.hsl = function(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    let h;
    let s;
    if (max === min) {
      h = 0;
    } else if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else if (b === max) {
      h = 4 + (r - g) / delta;
    }
    h = Math.min(h * 60, 360);
    if (h < 0) {
      h += 360;
    }
    const l = (min + max) / 2;
    if (max === min) {
      s = 0;
    } else if (l <= 0.5) {
      s = delta / (max + min);
    } else {
      s = delta / (2 - max - min);
    }
    return [h, s * 100, l * 100];
  };
  convert.rgb.hsv = function(rgb) {
    let rdif;
    let gdif;
    let bdif;
    let h;
    let s;
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const v = Math.max(r, g, b);
    const diff = v - Math.min(r, g, b);
    const diffc = function(c) {
      return (v - c) / 6 / diff + 1 / 2;
    };
    if (diff === 0) {
      h = 0;
      s = 0;
    } else {
      s = diff / v;
      rdif = diffc(r);
      gdif = diffc(g);
      bdif = diffc(b);
      if (r === v) {
        h = bdif - gdif;
      } else if (g === v) {
        h = 1 / 3 + rdif - bdif;
      } else if (b === v) {
        h = 2 / 3 + gdif - rdif;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }
    return [
      h * 360,
      s * 100,
      v * 100
    ];
  };
  convert.rgb.hwb = function(rgb) {
    const r = rgb[0];
    const g = rgb[1];
    let b = rgb[2];
    const h = convert.rgb.hsl(rgb)[0];
    const w = 1 / 255 * Math.min(r, Math.min(g, b));
    b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
    return [h, w * 100, b * 100];
  };
  convert.rgb.cmyk = function(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const k = Math.min(1 - r, 1 - g, 1 - b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;
    return [c * 100, m * 100, y * 100, k * 100];
  };
  convert.rgb.keyword = function(rgb) {
    const reversed = reverseKeywords[rgb];
    if (reversed) {
      return reversed;
    }
    let currentClosestDistance = Infinity;
    let currentClosestKeyword;
    for (const keyword of Object.keys(cssKeywords)) {
      const value = cssKeywords[keyword];
      const distance = comparativeDistance(rgb, value);
      if (distance < currentClosestDistance) {
        currentClosestDistance = distance;
        currentClosestKeyword = keyword;
      }
    }
    return currentClosestKeyword;
  };
  convert.keyword.rgb = function(keyword) {
    return cssKeywords[keyword];
  };
  convert.rgb.xyz = function(rgb) {
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;
    r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
    g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
    b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
    const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    return [x * 100, y * 100, z * 100];
  };
  convert.rgb.lab = function(rgb) {
    const xyz = convert.rgb.xyz(rgb);
    let x = xyz[0];
    let y = xyz[1];
    let z = xyz[2];
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    x = x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);
    return [l, a, b];
  };
  convert.hsl.rgb = function(hsl) {
    const h = hsl[0] / 360;
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;
    let t2;
    let t3;
    let val;
    if (s === 0) {
      val = l * 255;
      return [val, val, val];
    }
    if (l < 0.5) {
      t2 = l * (1 + s);
    } else {
      t2 = l + s - l * s;
    }
    const t1 = 2 * l - t2;
    const rgb = [0, 0, 0];
    for (let i = 0;i < 3; i++) {
      t3 = h + 1 / 3 * -(i - 1);
      if (t3 < 0) {
        t3++;
      }
      if (t3 > 1) {
        t3--;
      }
      if (6 * t3 < 1) {
        val = t1 + (t2 - t1) * 6 * t3;
      } else if (2 * t3 < 1) {
        val = t2;
      } else if (3 * t3 < 2) {
        val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
      } else {
        val = t1;
      }
      rgb[i] = val * 255;
    }
    return rgb;
  };
  convert.hsl.hsv = function(hsl) {
    const h = hsl[0];
    let s = hsl[1] / 100;
    let l = hsl[2] / 100;
    let smin = s;
    const lmin = Math.max(l, 0.01);
    l *= 2;
    s *= l <= 1 ? l : 2 - l;
    smin *= lmin <= 1 ? lmin : 2 - lmin;
    const v = (l + s) / 2;
    const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
    return [h, sv * 100, v * 100];
  };
  convert.hsv.rgb = function(hsv) {
    const h = hsv[0] / 60;
    const s = hsv[1] / 100;
    let v = hsv[2] / 100;
    const hi = Math.floor(h) % 6;
    const f = h - Math.floor(h);
    const p = 255 * v * (1 - s);
    const q = 255 * v * (1 - s * f);
    const t = 255 * v * (1 - s * (1 - f));
    v *= 255;
    switch (hi) {
      case 0:
        return [v, t, p];
      case 1:
        return [q, v, p];
      case 2:
        return [p, v, t];
      case 3:
        return [p, q, v];
      case 4:
        return [t, p, v];
      case 5:
        return [v, p, q];
    }
  };
  convert.hsv.hsl = function(hsv) {
    const h = hsv[0];
    const s = hsv[1] / 100;
    const v = hsv[2] / 100;
    const vmin = Math.max(v, 0.01);
    let sl;
    let l;
    l = (2 - s) * v;
    const lmin = (2 - s) * vmin;
    sl = s * vmin;
    sl /= lmin <= 1 ? lmin : 2 - lmin;
    sl = sl || 0;
    l /= 2;
    return [h, sl * 100, l * 100];
  };
  convert.hwb.rgb = function(hwb) {
    const h = hwb[0] / 360;
    let wh = hwb[1] / 100;
    let bl = hwb[2] / 100;
    const ratio = wh + bl;
    let f;
    if (ratio > 1) {
      wh /= ratio;
      bl /= ratio;
    }
    const i = Math.floor(6 * h);
    const v = 1 - bl;
    f = 6 * h - i;
    if ((i & 1) !== 0) {
      f = 1 - f;
    }
    const n = wh + f * (v - wh);
    let r;
    let g;
    let b;
    switch (i) {
      default:
      case 6:
      case 0:
        r = v;
        g = n;
        b = wh;
        break;
      case 1:
        r = n;
        g = v;
        b = wh;
        break;
      case 2:
        r = wh;
        g = v;
        b = n;
        break;
      case 3:
        r = wh;
        g = n;
        b = v;
        break;
      case 4:
        r = n;
        g = wh;
        b = v;
        break;
      case 5:
        r = v;
        g = wh;
        b = n;
        break;
    }
    return [r * 255, g * 255, b * 255];
  };
  convert.cmyk.rgb = function(cmyk) {
    const c = cmyk[0] / 100;
    const m = cmyk[1] / 100;
    const y = cmyk[2] / 100;
    const k = cmyk[3] / 100;
    const r = 1 - Math.min(1, c * (1 - k) + k);
    const g = 1 - Math.min(1, m * (1 - k) + k);
    const b = 1 - Math.min(1, y * (1 - k) + k);
    return [r * 255, g * 255, b * 255];
  };
  convert.xyz.rgb = function(xyz) {
    const x = xyz[0] / 100;
    const y = xyz[1] / 100;
    const z = xyz[2] / 100;
    let r;
    let g;
    let b;
    r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    b = x * 0.0557 + y * -0.204 + z * 1.057;
    r = r > 0.0031308 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
    g = g > 0.0031308 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
    b = b > 0.0031308 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
    r = Math.min(Math.max(0, r), 1);
    g = Math.min(Math.max(0, g), 1);
    b = Math.min(Math.max(0, b), 1);
    return [r * 255, g * 255, b * 255];
  };
  convert.xyz.lab = function(xyz) {
    let x = xyz[0];
    let y = xyz[1];
    let z = xyz[2];
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    x = x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);
    return [l, a, b];
  };
  convert.lab.xyz = function(lab) {
    const l = lab[0];
    const a = lab[1];
    const b = lab[2];
    let x;
    let y;
    let z;
    y = (l + 16) / 116;
    x = a / 500 + y;
    z = y - b / 200;
    const y2 = y ** 3;
    const x2 = x ** 3;
    const z2 = z ** 3;
    y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
    x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
    z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;
    x *= 95.047;
    y *= 100;
    z *= 108.883;
    return [x, y, z];
  };
  convert.lab.lch = function(lab) {
    const l = lab[0];
    const a = lab[1];
    const b = lab[2];
    let h;
    const hr = Math.atan2(b, a);
    h = hr * 360 / 2 / Math.PI;
    if (h < 0) {
      h += 360;
    }
    const c = Math.sqrt(a * a + b * b);
    return [l, c, h];
  };
  convert.lch.lab = function(lch) {
    const l = lch[0];
    const c = lch[1];
    const h = lch[2];
    const hr = h / 360 * 2 * Math.PI;
    const a = c * Math.cos(hr);
    const b = c * Math.sin(hr);
    return [l, a, b];
  };
  convert.rgb.ansi16 = function(args, saturation = null) {
    const [r, g, b] = args;
    let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
    value = Math.round(value / 50);
    if (value === 0) {
      return 30;
    }
    let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
    if (value === 2) {
      ansi += 60;
    }
    return ansi;
  };
  convert.hsv.ansi16 = function(args) {
    return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
  };
  convert.rgb.ansi256 = function(args) {
    const r = args[0];
    const g = args[1];
    const b = args[2];
    if (r === g && g === b) {
      if (r < 8) {
        return 16;
      }
      if (r > 248) {
        return 231;
      }
      return Math.round((r - 8) / 247 * 24) + 232;
    }
    const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
    return ansi;
  };
  convert.ansi16.rgb = function(args) {
    let color = args % 10;
    if (color === 0 || color === 7) {
      if (args > 50) {
        color += 3.5;
      }
      color = color / 10.5 * 255;
      return [color, color, color];
    }
    const mult = (~~(args > 50) + 1) * 0.5;
    const r = (color & 1) * mult * 255;
    const g = (color >> 1 & 1) * mult * 255;
    const b = (color >> 2 & 1) * mult * 255;
    return [r, g, b];
  };
  convert.ansi256.rgb = function(args) {
    if (args >= 232) {
      const c = (args - 232) * 10 + 8;
      return [c, c, c];
    }
    args -= 16;
    let rem;
    const r = Math.floor(args / 36) / 5 * 255;
    const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
    const b = rem % 6 / 5 * 255;
    return [r, g, b];
  };
  convert.rgb.hex = function(args) {
    const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
    const string = integer.toString(16).toUpperCase();
    return "000000".substring(string.length) + string;
  };
  convert.hex.rgb = function(args) {
    const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!match) {
      return [0, 0, 0];
    }
    let colorString = match[0];
    if (match[0].length === 3) {
      colorString = colorString.split("").map((char) => {
        return char + char;
      }).join("");
    }
    const integer = parseInt(colorString, 16);
    const r = integer >> 16 & 255;
    const g = integer >> 8 & 255;
    const b = integer & 255;
    return [r, g, b];
  };
  convert.rgb.hcg = function(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const max = Math.max(Math.max(r, g), b);
    const min = Math.min(Math.min(r, g), b);
    const chroma = max - min;
    let grayscale;
    let hue;
    if (chroma < 1) {
      grayscale = min / (1 - chroma);
    } else {
      grayscale = 0;
    }
    if (chroma <= 0) {
      hue = 0;
    } else if (max === r) {
      hue = (g - b) / chroma % 6;
    } else if (max === g) {
      hue = 2 + (b - r) / chroma;
    } else {
      hue = 4 + (r - g) / chroma;
    }
    hue /= 6;
    hue %= 1;
    return [hue * 360, chroma * 100, grayscale * 100];
  };
  convert.hsl.hcg = function(hsl) {
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;
    const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
    let f = 0;
    if (c < 1) {
      f = (l - 0.5 * c) / (1 - c);
    }
    return [hsl[0], c * 100, f * 100];
  };
  convert.hsv.hcg = function(hsv) {
    const s = hsv[1] / 100;
    const v = hsv[2] / 100;
    const c = s * v;
    let f = 0;
    if (c < 1) {
      f = (v - c) / (1 - c);
    }
    return [hsv[0], c * 100, f * 100];
  };
  convert.hcg.rgb = function(hcg) {
    const h = hcg[0] / 360;
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    if (c === 0) {
      return [g * 255, g * 255, g * 255];
    }
    const pure = [0, 0, 0];
    const hi = h % 1 * 6;
    const v = hi % 1;
    const w = 1 - v;
    let mg = 0;
    switch (Math.floor(hi)) {
      case 0:
        pure[0] = 1;
        pure[1] = v;
        pure[2] = 0;
        break;
      case 1:
        pure[0] = w;
        pure[1] = 1;
        pure[2] = 0;
        break;
      case 2:
        pure[0] = 0;
        pure[1] = 1;
        pure[2] = v;
        break;
      case 3:
        pure[0] = 0;
        pure[1] = w;
        pure[2] = 1;
        break;
      case 4:
        pure[0] = v;
        pure[1] = 0;
        pure[2] = 1;
        break;
      default:
        pure[0] = 1;
        pure[1] = 0;
        pure[2] = w;
    }
    mg = (1 - c) * g;
    return [
      (c * pure[0] + mg) * 255,
      (c * pure[1] + mg) * 255,
      (c * pure[2] + mg) * 255
    ];
  };
  convert.hcg.hsv = function(hcg) {
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    const v = c + g * (1 - c);
    let f = 0;
    if (v > 0) {
      f = c / v;
    }
    return [hcg[0], f * 100, v * 100];
  };
  convert.hcg.hsl = function(hcg) {
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    const l = g * (1 - c) + 0.5 * c;
    let s = 0;
    if (l > 0 && l < 0.5) {
      s = c / (2 * l);
    } else if (l >= 0.5 && l < 1) {
      s = c / (2 * (1 - l));
    }
    return [hcg[0], s * 100, l * 100];
  };
  convert.hcg.hwb = function(hcg) {
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    const v = c + g * (1 - c);
    return [hcg[0], (v - c) * 100, (1 - v) * 100];
  };
  convert.hwb.hcg = function(hwb) {
    const w = hwb[1] / 100;
    const b = hwb[2] / 100;
    const v = 1 - b;
    const c = v - w;
    let g = 0;
    if (c < 1) {
      g = (v - c) / (1 - c);
    }
    return [hwb[0], c * 100, g * 100];
  };
  convert.apple.rgb = function(apple) {
    return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
  };
  convert.rgb.apple = function(rgb) {
    return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
  };
  convert.gray.rgb = function(args) {
    return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
  };
  convert.gray.hsl = function(args) {
    return [0, 0, args[0]];
  };
  convert.gray.hsv = convert.gray.hsl;
  convert.gray.hwb = function(gray) {
    return [0, 100, gray[0]];
  };
  convert.gray.cmyk = function(gray) {
    return [0, 0, 0, gray[0]];
  };
  convert.gray.lab = function(gray) {
    return [gray[0], 0, 0];
  };
  convert.gray.hex = function(gray) {
    const val = Math.round(gray[0] / 100 * 255) & 255;
    const integer = (val << 16) + (val << 8) + val;
    const string = integer.toString(16).toUpperCase();
    return "000000".substring(string.length) + string;
  };
  convert.rgb.gray = function(rgb) {
    const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
    return [val / 255 * 100];
  };
});

// node_modules/color-convert/route.js
var require_route = __commonJS((exports, module) => {
  function buildGraph() {
    const graph = {};
    const models = Object.keys(conversions);
    for (let len = models.length, i = 0;i < len; i++) {
      graph[models[i]] = {
        distance: -1,
        parent: null
      };
    }
    return graph;
  }
  function deriveBFS(fromModel) {
    const graph = buildGraph();
    const queue = [fromModel];
    graph[fromModel].distance = 0;
    while (queue.length) {
      const current = queue.pop();
      const adjacents = Object.keys(conversions[current]);
      for (let len = adjacents.length, i = 0;i < len; i++) {
        const adjacent = adjacents[i];
        const node = graph[adjacent];
        if (node.distance === -1) {
          node.distance = graph[current].distance + 1;
          node.parent = current;
          queue.unshift(adjacent);
        }
      }
    }
    return graph;
  }
  function link(from, to) {
    return function(args) {
      return to(from(args));
    };
  }
  function wrapConversion(toModel, graph) {
    const path = [graph[toModel].parent, toModel];
    let fn = conversions[graph[toModel].parent][toModel];
    let cur = graph[toModel].parent;
    while (graph[cur].parent) {
      path.unshift(graph[cur].parent);
      fn = link(conversions[graph[cur].parent][cur], fn);
      cur = graph[cur].parent;
    }
    fn.conversion = path;
    return fn;
  }
  var conversions = require_conversions();
  module.exports = function(fromModel) {
    const graph = deriveBFS(fromModel);
    const conversion = {};
    const models = Object.keys(graph);
    for (let len = models.length, i = 0;i < len; i++) {
      const toModel = models[i];
      const node = graph[toModel];
      if (node.parent === null) {
        continue;
      }
      conversion[toModel] = wrapConversion(toModel, graph);
    }
    return conversion;
  };
});

// node_modules/color-convert/index.js
var require_color_convert = __commonJS((exports, module) => {
  function wrapRaw(fn) {
    const wrappedFn = function(...args) {
      const arg0 = args[0];
      if (arg0 === undefined || arg0 === null) {
        return arg0;
      }
      if (arg0.length > 1) {
        args = arg0;
      }
      return fn(args);
    };
    if ("conversion" in fn) {
      wrappedFn.conversion = fn.conversion;
    }
    return wrappedFn;
  }
  function wrapRounded(fn) {
    const wrappedFn = function(...args) {
      const arg0 = args[0];
      if (arg0 === undefined || arg0 === null) {
        return arg0;
      }
      if (arg0.length > 1) {
        args = arg0;
      }
      const result = fn(args);
      if (typeof result === "object") {
        for (let len = result.length, i = 0;i < len; i++) {
          result[i] = Math.round(result[i]);
        }
      }
      return result;
    };
    if ("conversion" in fn) {
      wrappedFn.conversion = fn.conversion;
    }
    return wrappedFn;
  }
  var conversions = require_conversions();
  var route = require_route();
  var convert = {};
  var models = Object.keys(conversions);
  models.forEach((fromModel) => {
    convert[fromModel] = {};
    Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
    Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
    const routes = route(fromModel);
    const routeModels = Object.keys(routes);
    routeModels.forEach((toModel) => {
      const fn = routes[toModel];
      convert[fromModel][toModel] = wrapRounded(fn);
      convert[fromModel][toModel].raw = wrapRaw(fn);
    });
  });
  module.exports = convert;
});

// node_modules/ansi-styles/index.js
var require_ansi_styles = __commonJS((exports, module) => {
  function assembleStyles() {
    const codes = new Map;
    const styles = {
      modifier: {
        reset: [0, 0],
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
        inverse: [7, 27],
        hidden: [8, 28],
        strikethrough: [9, 29]
      },
      color: {
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        blackBright: [90, 39],
        redBright: [91, 39],
        greenBright: [92, 39],
        yellowBright: [93, 39],
        blueBright: [94, 39],
        magentaBright: [95, 39],
        cyanBright: [96, 39],
        whiteBright: [97, 39]
      },
      bgColor: {
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        bgBlackBright: [100, 49],
        bgRedBright: [101, 49],
        bgGreenBright: [102, 49],
        bgYellowBright: [103, 49],
        bgBlueBright: [104, 49],
        bgMagentaBright: [105, 49],
        bgCyanBright: [106, 49],
        bgWhiteBright: [107, 49]
      }
    };
    styles.color.gray = styles.color.blackBright;
    styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
    styles.color.grey = styles.color.blackBright;
    styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
    for (const [groupName, group] of Object.entries(styles)) {
      for (const [styleName, style] of Object.entries(group)) {
        styles[styleName] = {
          open: `\x1B[${style[0]}m`,
          close: `\x1B[${style[1]}m`
        };
        group[styleName] = styles[styleName];
        codes.set(style[0], style[1]);
      }
      Object.defineProperty(styles, groupName, {
        value: group,
        enumerable: false
      });
    }
    Object.defineProperty(styles, "codes", {
      value: codes,
      enumerable: false
    });
    styles.color.close = "\x1B[39m";
    styles.bgColor.close = "\x1B[49m";
    setLazyProperty(styles.color, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, false));
    setLazyProperty(styles.color, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, false));
    setLazyProperty(styles.color, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, false));
    setLazyProperty(styles.bgColor, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, true));
    setLazyProperty(styles.bgColor, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, true));
    setLazyProperty(styles.bgColor, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, true));
    return styles;
  }
  var wrapAnsi16 = (fn, offset) => (...args) => {
    const code = fn(...args);
    return `\x1B[${code + offset}m`;
  };
  var wrapAnsi256 = (fn, offset) => (...args) => {
    const code = fn(...args);
    return `\x1B[${38 + offset};5;${code}m`;
  };
  var wrapAnsi16m = (fn, offset) => (...args) => {
    const rgb = fn(...args);
    return `\x1B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
  };
  var ansi2ansi = (n) => n;
  var rgb2rgb = (r, g, b) => [r, g, b];
  var setLazyProperty = (object, property, get) => {
    Object.defineProperty(object, property, {
      get: () => {
        const value = get();
        Object.defineProperty(object, property, {
          value,
          enumerable: true,
          configurable: true
        });
        return value;
      },
      enumerable: true,
      configurable: true
    });
  };
  var colorConvert;
  var makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
    if (colorConvert === undefined) {
      colorConvert = require_color_convert();
    }
    const offset = isBackground ? 10 : 0;
    const styles = {};
    for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
      const name = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
      if (sourceSpace === targetSpace) {
        styles[name] = wrap(identity, offset);
      } else if (typeof suite === "object") {
        styles[name] = wrap(suite[targetSpace], offset);
      }
    }
    return styles;
  };
  Object.defineProperty(module, "exports", {
    enumerable: true,
    get: assembleStyles
  });
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS((exports, module) => {
  module.exports = (flag, argv = process.argv) => {
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf("--");
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
  };
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS((exports, module) => {
  function translateLevel(level) {
    if (level === 0) {
      return false;
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
      return 0;
    }
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === undefined) {
      return 0;
    }
    const min = forceColor || 0;
    if (env.TERM === "dumb") {
      return min;
    }
    if (process.platform === "win32") {
      const osRelease = os.release().split(".");
      if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ("CI" in env) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => (sign in env)) || env.CI_NAME === "codeship") {
        return 1;
      }
      return min;
    }
    if ("TEAMCITY_VERSION" in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
      return 3;
    }
    if ("TERM_PROGRAM" in env) {
      const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env.TERM_PROGRAM) {
        case "iTerm.app":
          return version >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1;
    }
    if ("COLORTERM" in env) {
      return 1;
    }
    return min;
  }
  function getSupportLevel(stream) {
    const level = supportsColor(stream, stream && stream.isTTY);
    return translateLevel(level);
  }
  var os = __require("os");
  var tty = __require("tty");
  var hasFlag = require_has_flag();
  var { env } = process;
  var forceColor;
  if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
    forceColor = 0;
  } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
    forceColor = 1;
  }
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      forceColor = 1;
    } else if (env.FORCE_COLOR === "false") {
      forceColor = 0;
    } else {
      forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
  }
  module.exports = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2)))
  };
});

// node_modules/chalk/source/util.js
var require_util = __commonJS((exports, module) => {
  var stringReplaceAll = (string, substring, replacer) => {
    let index = string.indexOf(substring);
    if (index === -1) {
      return string;
    }
    const substringLength = substring.length;
    let endIndex = 0;
    let returnValue = "";
    do {
      returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
      endIndex = index + substringLength;
      index = string.indexOf(substring, endIndex);
    } while (index !== -1);
    returnValue += string.substr(endIndex);
    return returnValue;
  };
  var stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
    let endIndex = 0;
    let returnValue = "";
    do {
      const gotCR = string[index - 1] === "\r";
      returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
      endIndex = index + 1;
      index = string.indexOf("\n", endIndex);
    } while (index !== -1);
    returnValue += string.substr(endIndex);
    return returnValue;
  };
  module.exports = {
    stringReplaceAll,
    stringEncaseCRLFWithFirstIndex
  };
});

// node_modules/chalk/source/templates.js
var require_templates = __commonJS((exports, module) => {
  function unescape(c) {
    const u = c[0] === "u";
    const bracket = c[1] === "{";
    if (u && !bracket && c.length === 5 || c[0] === "x" && c.length === 3) {
      return String.fromCharCode(parseInt(c.slice(1), 16));
    }
    if (u && bracket) {
      return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
    }
    return ESCAPES.get(c) || c;
  }
  function parseArguments(name, arguments_) {
    const results = [];
    const chunks = arguments_.trim().split(/\s*,\s*/g);
    let matches;
    for (const chunk of chunks) {
      const number = Number(chunk);
      if (!Number.isNaN(number)) {
        results.push(number);
      } else if (matches = chunk.match(STRING_REGEX)) {
        results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
      } else {
        throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
      }
    }
    return results;
  }
  function parseStyle(style) {
    STYLE_REGEX.lastIndex = 0;
    const results = [];
    let matches;
    while ((matches = STYLE_REGEX.exec(style)) !== null) {
      const name = matches[1];
      if (matches[2]) {
        const args = parseArguments(name, matches[2]);
        results.push([name].concat(args));
      } else {
        results.push([name]);
      }
    }
    return results;
  }
  function buildStyle(chalk, styles) {
    const enabled = {};
    for (const layer of styles) {
      for (const style of layer.styles) {
        enabled[style[0]] = layer.inverse ? null : style.slice(1);
      }
    }
    let current = chalk;
    for (const [styleName, styles2] of Object.entries(enabled)) {
      if (!Array.isArray(styles2)) {
        continue;
      }
      if (!(styleName in current)) {
        throw new Error(`Unknown Chalk style: ${styleName}`);
      }
      current = styles2.length > 0 ? current[styleName](...styles2) : current[styleName];
    }
    return current;
  }
  var TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
  var STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
  var STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
  var ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;
  var ESCAPES = new Map([
    ["n", "\n"],
    ["r", "\r"],
    ["t", "\t"],
    ["b", "\b"],
    ["f", "\f"],
    ["v", "\v"],
    ["0", "\0"],
    ["\\", "\\"],
    ["e", "\x1B"],
    ["a", "\x07"]
  ]);
  module.exports = (chalk, temporary) => {
    const styles = [];
    const chunks = [];
    let chunk = [];
    temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
      if (escapeCharacter) {
        chunk.push(unescape(escapeCharacter));
      } else if (style) {
        const string = chunk.join("");
        chunk = [];
        chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
        styles.push({ inverse, styles: parseStyle(style) });
      } else if (close) {
        if (styles.length === 0) {
          throw new Error("Found extraneous } in Chalk template literal");
        }
        chunks.push(buildStyle(chalk, styles)(chunk.join("")));
        chunk = [];
        styles.pop();
      } else {
        chunk.push(character);
      }
    });
    chunks.push(chunk.join(""));
    if (styles.length > 0) {
      const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
      throw new Error(errMessage);
    }
    return chunks.join("");
  };
});

// node_modules/chalk/source/index.js
var require_source = __commonJS((exports, module) => {
  function Chalk(options) {
    return chalkFactory(options);
  }
  var ansiStyles = require_ansi_styles();
  var { stdout: stdoutColor, stderr: stderrColor } = require_supports_color();
  var {
    stringReplaceAll,
    stringEncaseCRLFWithFirstIndex
  } = require_util();
  var { isArray } = Array;
  var levelMapping = [
    "ansi",
    "ansi",
    "ansi256",
    "ansi16m"
  ];
  var styles = Object.create(null);
  var applyOptions = (object, options = {}) => {
    if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
      throw new Error("The `level` option should be an integer from 0 to 3");
    }
    const colorLevel = stdoutColor ? stdoutColor.level : 0;
    object.level = options.level === undefined ? colorLevel : options.level;
  };

  class ChalkClass {
    constructor(options) {
      return chalkFactory(options);
    }
  }
  var chalkFactory = (options) => {
    const chalk2 = {};
    applyOptions(chalk2, options);
    chalk2.template = (...arguments_) => chalkTag(chalk2.template, ...arguments_);
    Object.setPrototypeOf(chalk2, Chalk.prototype);
    Object.setPrototypeOf(chalk2.template, chalk2);
    chalk2.template.constructor = () => {
      throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
    };
    chalk2.template.Instance = ChalkClass;
    return chalk2.template;
  };
  for (const [styleName, style] of Object.entries(ansiStyles)) {
    styles[styleName] = {
      get() {
        const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
        Object.defineProperty(this, styleName, { value: builder });
        return builder;
      }
    };
  }
  styles.visible = {
    get() {
      const builder = createBuilder(this, this._styler, true);
      Object.defineProperty(this, "visible", { value: builder });
      return builder;
    }
  };
  var usedModels = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
  for (const model of usedModels) {
    styles[model] = {
      get() {
        const { level } = this;
        return function(...arguments_) {
          const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
          return createBuilder(this, styler, this._isEmpty);
        };
      }
    };
  }
  for (const model of usedModels) {
    const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
    styles[bgModel] = {
      get() {
        const { level } = this;
        return function(...arguments_) {
          const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
          return createBuilder(this, styler, this._isEmpty);
        };
      }
    };
  }
  var proto = Object.defineProperties(() => {
  }, {
    ...styles,
    level: {
      enumerable: true,
      get() {
        return this._generator.level;
      },
      set(level) {
        this._generator.level = level;
      }
    }
  });
  var createStyler = (open, close, parent) => {
    let openAll;
    let closeAll;
    if (parent === undefined) {
      openAll = open;
      closeAll = close;
    } else {
      openAll = parent.openAll + open;
      closeAll = close + parent.closeAll;
    }
    return {
      open,
      close,
      openAll,
      closeAll,
      parent
    };
  };
  var createBuilder = (self, _styler, _isEmpty) => {
    const builder = (...arguments_) => {
      if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
        return applyStyle(builder, chalkTag(builder, ...arguments_));
      }
      return applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
    };
    Object.setPrototypeOf(builder, proto);
    builder._generator = self;
    builder._styler = _styler;
    builder._isEmpty = _isEmpty;
    return builder;
  };
  var applyStyle = (self, string) => {
    if (self.level <= 0 || !string) {
      return self._isEmpty ? "" : string;
    }
    let styler = self._styler;
    if (styler === undefined) {
      return string;
    }
    const { openAll, closeAll } = styler;
    if (string.indexOf("\x1B") !== -1) {
      while (styler !== undefined) {
        string = stringReplaceAll(string, styler.close, styler.open);
        styler = styler.parent;
      }
    }
    const lfIndex = string.indexOf("\n");
    if (lfIndex !== -1) {
      string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
    }
    return openAll + string + closeAll;
  };
  var template;
  var chalkTag = (chalk2, ...strings) => {
    const [firstString] = strings;
    if (!isArray(firstString) || !isArray(firstString.raw)) {
      return strings.join(" ");
    }
    const arguments_ = strings.slice(1);
    const parts = [firstString.raw[0]];
    for (let i = 1;i < firstString.length; i++) {
      parts.push(String(arguments_[i - 1]).replace(/[{}\\]/g, "\\$&"), String(firstString.raw[i]));
    }
    if (template === undefined) {
      template = require_templates();
    }
    return template(chalk2, parts.join(""));
  };
  Object.defineProperties(Chalk.prototype, styles);
  var chalk = Chalk();
  chalk.supportsColor = stdoutColor;
  chalk.stderr = Chalk({ level: stderrColor ? stderrColor.level : 0 });
  chalk.stderr.supportsColor = stderrColor;
  module.exports = chalk;
});

// facades/System.ts
var import_dotenv = __toESM(require_main(), 1);
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
    this.socket.send(messageBuffer, 0, messageBuffer.length, port, "127.0.0.1");
    console.log(address, messageBuffer);
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

// controllers/ChatController.ts
class ChatController {
  newChat(req) {
    const { data } = req;
    console.log("chat", data.discussion);
  }
}

// controllers/SearchController.ts
var import_chalk = __toESM(require_source(), 1);

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
  delete(slug, entity) {
    const dataList = this.getAllData();
    const tablename = entity.getEntityName();
    if (Array.isArray(dataList[tablename]) && 0 < dataList[tablename].length) {
      const data = dataList[tablename];
      for (let i = 0;i < data.length; i++) {
        if (data[i].slug === slug) {
          dataList[tablename].splice(i, 1);
          break;
        }
      }
      this.fileSystem.write(dataList);
      return true;
    }
    return false;
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

// contexts/file/AbstractFileContext.ts
import {readdirSync, statSync} from "fs";
import {userInfo} from "os";
import {join} from "path";

class AbstractFileContext {
  scan(criteria, userHome = userInfo().homedir) {
    const dirs = readdirSync(userHome);
    const matchs = [];
    dirs.forEach((dir) => {
      const fullpath = join(userHome, dir);
      if (!this.isHidden(dir) && this.match(fullpath, criteria)) {
        matchs.push(fullpath);
      }
      if (this.isValidDir(fullpath) && !this.isHidden(dir)) {
        matchs.push(...this.scan(criteria, fullpath));
      }
    });
    return matchs;
  }
  isValidDir(dir) {
    const exceptions = ["node_modules", "vendor", ".git"];
    const isDirectory = statSync(dir).isDirectory();
    let includeExceptions = false;
    exceptions.forEach((exception) => {
      if (dir.includes(exception)) {
        includeExceptions = true;
      }
    });
    return isDirectory && !includeExceptions;
  }
  isHidden(dir) {
    return dir.charAt(0) == ".";
  }
}

// contexts/file/byContent/Content.ts
class Content extends AbstractFileContext {
  match(dir) {
    return false;
  }
}

// contexts/file/byLocal/Local.ts
import {extname} from "path";
class Local extends AbstractFileContext {
  match(dir, criteria) {
    let isValid = true;
    if (!this.includeKeys(criteria.keys, dir)) {
      return false;
    }
    if (!this.includeExtension(criteria.extension, dir)) {
      return false;
    }
    return true;
  }
  includeKeys(keys, pathname) {
    for (let i = 0;i < keys.length; i++) {
      const key = keys[i];
      const includeAll = pathname.toLocaleLowerCase().includes(key.toLocaleLowerCase());
      if (!includeAll) {
        return false;
      }
    }
    return true;
  }
  includeExtension(extension, pathname) {
    const pathextname = extname(pathname);
    return pathextname === extension;
  }
}

// contexts/file/Factory.ts
class FileFactory {
  static create(searchFileType) {
    switch (searchFileType) {
      case "local":
        return new Local;
      case "content":
        return new Content;
        break;
      default:
        return null;
    }
  }
}

// contexts/file/FileContext.ts
class FileContext {
  search(content) {
    const fileSearcher = FileFactory.create("local");
    const matchs = fileSearcher?.scan(content);
    return matchs;
  }
}

// contexts/Factory.ts
class Factory2 {
  static create(contextType) {
    switch (contextType) {
      case "file":
        return new FileContext;
      default:
        return null;
    }
  }
}

// core/AppEvent.ts
import Event from "events";

class AppEvent {
  evt;
  static instance = null;
  constructor() {
    this.evt = new Event;
  }
  emit(eventName) {
    this.evt.emit(eventName);
  }
  async on(eventName) {
    return new Promise((resolve) => {
      this.evt.on(eventName, resolve);
    });
  }
  static create() {
    return AppEvent.instance === null ? new AppEvent : AppEvent.instance;
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
    const searcherContext = Factory2.create("file");
    const results = searcherContext?.search(searchBody.content[0]);
    if (results?.length && results.length > 0) {
      request.send(remoteAddress, remotePort, { label: "/found", data: { identity, search: searchBody } });
    }
  }
  found(body) {
    const manager = Database.getManager();
    const repository = Database.getRepository();
    const slug = body.data.search.slug;
    console.log("body data ", body.data.identity);
    const identity = new Idenity().set(body.data.identity);
    const search = repository.getBySlug(slug, new Search);
    search?.addfounders(identity);
    manager.update(slug, search);
    console.log("\nSearch name: ", import_chalk.default.blueBright(search?.getname()), "found by:", identity.getname());
    AppEvent.create().emit("found");
  }
}

// controllers/SystemController.ts
class SystemController {
  init() {
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
var { newChat } = new ChatController;
router.addRoute("/hello-world", init);
router.addRoute("/search", search);
router.addRoute("/found", found);
router.addRoute("/chat", newChat);

// services/identity/IdenityService.ts
class IdentityService {
  init(server) {
    const repository = Database.getRepository();
    const networkInfo = new Network().getIpv4Info(server.getUseInterface());
    console.log("networkInfo", networkInfo);
    let identity = new Idenity;
    identity = repository.getBySlug(identity.getslug(), identity);
    if (!identity && networkInfo) {
      const manager = Database.getManager();
      identity = new Idenity;
      identity.setname(networkInfo?.address).setphysicalAddress(networkInfo.mac).setipv4(networkInfo.address);
      manager.create(identity);
    }
  }
}

// facades/System.ts
import_dotenv.config();

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
    console.log("resend.....");
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
  delete(slug) {
    console.log("delete....");
    const search2 = new Search;
    this.manager.delete(slug, search2);
  }
  makeRequest(newSearch) {
    const server = Multicast.getConnexion();
    const socket = server.getSocket();
    if (!socket) {
      throw "Failed to connect";
    }
    const request = new Request(socket);
    request.send(server.getAddress(), server.getPort(), { label: "/search", data: newSearch });
  }
  generateHash() {
    const randomize = randomBytes2(16);
    const hash = randomize.toString("hex");
    return hash;
  }
}

// entity/Chat.ts
class Chat extends Entity {
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
    const newChat2 = new Chat;
    newChat2.setname(name || user.getname()).setuser(user).adddiscussion({ user: currentUser, content: [message] }).setstatus("active");
    this.manager.create(newChat2);
    this.makeRequest(newChat2, user.getipv4());
  }
  makeRequest(newChat2, address) {
    const server = Multicast.getConnexion();
    const socket = server.getSocket();
    if (socket) {
      const request = new Request(socket);
      request.send(address || server.getAddress(), server.getPort(), { label: "/chat", data: newChat2 });
    }
  }
}

// index.ts
var system = new System;
var search2 = new SearchFacade;
var identity = new IdentityFacade;
var network = new Network;
var chat = new ChatFacade;
system.init();
identity.update("Shiro y");
search2.create({ name: "Teste", content: [{ keys: ["Halsey"], extension: ".mp3" }] });
