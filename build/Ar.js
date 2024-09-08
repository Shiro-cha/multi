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

// node_modules/commander/lib/error.js
var require_error = __commonJS((exports) => {
  class CommanderError extends Error {
    constructor(exitCode, code, message) {
      super(message);
      Error.captureStackTrace(this, this.constructor);
      this.name = this.constructor.name;
      this.code = code;
      this.exitCode = exitCode;
      this.nestedError = undefined;
    }
  }

  class InvalidArgumentError extends CommanderError {
    constructor(message) {
      super(1, "commander.invalidArgument", message);
      Error.captureStackTrace(this, this.constructor);
      this.name = this.constructor.name;
    }
  }
  exports.CommanderError = CommanderError;
  exports.InvalidArgumentError = InvalidArgumentError;
});

// node_modules/commander/lib/argument.js
var require_argument = __commonJS((exports) => {
  function humanReadableArgName(arg) {
    const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
    return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
  }
  var { InvalidArgumentError } = require_error();

  class Argument {
    constructor(name, description) {
      this.description = description || "";
      this.variadic = false;
      this.parseArg = undefined;
      this.defaultValue = undefined;
      this.defaultValueDescription = undefined;
      this.argChoices = undefined;
      switch (name[0]) {
        case "<":
          this.required = true;
          this._name = name.slice(1, -1);
          break;
        case "[":
          this.required = false;
          this._name = name.slice(1, -1);
          break;
        default:
          this.required = true;
          this._name = name;
          break;
      }
      if (this._name.length > 3 && this._name.slice(-3) === "...") {
        this.variadic = true;
        this._name = this._name.slice(0, -3);
      }
    }
    name() {
      return this._name;
    }
    _concatValue(value, previous) {
      if (previous === this.defaultValue || !Array.isArray(previous)) {
        return [value];
      }
      return previous.concat(value);
    }
    default(value, description) {
      this.defaultValue = value;
      this.defaultValueDescription = description;
      return this;
    }
    argParser(fn) {
      this.parseArg = fn;
      return this;
    }
    choices(values) {
      this.argChoices = values.slice();
      this.parseArg = (arg, previous) => {
        if (!this.argChoices.includes(arg)) {
          throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(", ")}.`);
        }
        if (this.variadic) {
          return this._concatValue(arg, previous);
        }
        return arg;
      };
      return this;
    }
    argRequired() {
      this.required = true;
      return this;
    }
    argOptional() {
      this.required = false;
      return this;
    }
  }
  exports.Argument = Argument;
  exports.humanReadableArgName = humanReadableArgName;
});

// node_modules/commander/lib/help.js
var require_help = __commonJS((exports) => {
  var { humanReadableArgName } = require_argument();

  class Help {
    constructor() {
      this.helpWidth = undefined;
      this.sortSubcommands = false;
      this.sortOptions = false;
      this.showGlobalOptions = false;
    }
    visibleCommands(cmd) {
      const visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden);
      const helpCommand = cmd._getHelpCommand();
      if (helpCommand && !helpCommand._hidden) {
        visibleCommands.push(helpCommand);
      }
      if (this.sortSubcommands) {
        visibleCommands.sort((a, b) => {
          return a.name().localeCompare(b.name());
        });
      }
      return visibleCommands;
    }
    compareOptions(a, b) {
      const getSortKey = (option) => {
        return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
      };
      return getSortKey(a).localeCompare(getSortKey(b));
    }
    visibleOptions(cmd) {
      const visibleOptions = cmd.options.filter((option) => !option.hidden);
      const helpOption = cmd._getHelpOption();
      if (helpOption && !helpOption.hidden) {
        const removeShort = helpOption.short && cmd._findOption(helpOption.short);
        const removeLong = helpOption.long && cmd._findOption(helpOption.long);
        if (!removeShort && !removeLong) {
          visibleOptions.push(helpOption);
        } else if (helpOption.long && !removeLong) {
          visibleOptions.push(cmd.createOption(helpOption.long, helpOption.description));
        } else if (helpOption.short && !removeShort) {
          visibleOptions.push(cmd.createOption(helpOption.short, helpOption.description));
        }
      }
      if (this.sortOptions) {
        visibleOptions.sort(this.compareOptions);
      }
      return visibleOptions;
    }
    visibleGlobalOptions(cmd) {
      if (!this.showGlobalOptions)
        return [];
      const globalOptions = [];
      for (let ancestorCmd = cmd.parent;ancestorCmd; ancestorCmd = ancestorCmd.parent) {
        const visibleOptions = ancestorCmd.options.filter((option) => !option.hidden);
        globalOptions.push(...visibleOptions);
      }
      if (this.sortOptions) {
        globalOptions.sort(this.compareOptions);
      }
      return globalOptions;
    }
    visibleArguments(cmd) {
      if (cmd._argsDescription) {
        cmd.registeredArguments.forEach((argument) => {
          argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
        });
      }
      if (cmd.registeredArguments.find((argument) => argument.description)) {
        return cmd.registeredArguments;
      }
      return [];
    }
    subcommandTerm(cmd) {
      const args = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
      return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + (args ? " " + args : "");
    }
    optionTerm(option) {
      return option.flags;
    }
    argumentTerm(argument) {
      return argument.name();
    }
    longestSubcommandTermLength(cmd, helper) {
      return helper.visibleCommands(cmd).reduce((max, command) => {
        return Math.max(max, helper.subcommandTerm(command).length);
      }, 0);
    }
    longestOptionTermLength(cmd, helper) {
      return helper.visibleOptions(cmd).reduce((max, option) => {
        return Math.max(max, helper.optionTerm(option).length);
      }, 0);
    }
    longestGlobalOptionTermLength(cmd, helper) {
      return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
        return Math.max(max, helper.optionTerm(option).length);
      }, 0);
    }
    longestArgumentTermLength(cmd, helper) {
      return helper.visibleArguments(cmd).reduce((max, argument) => {
        return Math.max(max, helper.argumentTerm(argument).length);
      }, 0);
    }
    commandUsage(cmd) {
      let cmdName = cmd._name;
      if (cmd._aliases[0]) {
        cmdName = cmdName + "|" + cmd._aliases[0];
      }
      let ancestorCmdNames = "";
      for (let ancestorCmd = cmd.parent;ancestorCmd; ancestorCmd = ancestorCmd.parent) {
        ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
      }
      return ancestorCmdNames + cmdName + " " + cmd.usage();
    }
    commandDescription(cmd) {
      return cmd.description();
    }
    subcommandDescription(cmd) {
      return cmd.summary() || cmd.description();
    }
    optionDescription(option) {
      const extraInfo = [];
      if (option.argChoices) {
        extraInfo.push(`choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`);
      }
      if (option.defaultValue !== undefined) {
        const showDefault = option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean";
        if (showDefault) {
          extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
        }
      }
      if (option.presetArg !== undefined && option.optional) {
        extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
      }
      if (option.envVar !== undefined) {
        extraInfo.push(`env: ${option.envVar}`);
      }
      if (extraInfo.length > 0) {
        return `${option.description} (${extraInfo.join(", ")})`;
      }
      return option.description;
    }
    argumentDescription(argument) {
      const extraInfo = [];
      if (argument.argChoices) {
        extraInfo.push(`choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`);
      }
      if (argument.defaultValue !== undefined) {
        extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
      }
      if (extraInfo.length > 0) {
        const extraDescripton = `(${extraInfo.join(", ")})`;
        if (argument.description) {
          return `${argument.description} ${extraDescripton}`;
        }
        return extraDescripton;
      }
      return argument.description;
    }
    formatHelp(cmd, helper) {
      const termWidth = helper.padWidth(cmd, helper);
      const helpWidth = helper.helpWidth || 80;
      const itemIndentWidth = 2;
      const itemSeparatorWidth = 2;
      function formatItem(term, description) {
        if (description) {
          const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
          return helper.wrap(fullText, helpWidth - itemIndentWidth, termWidth + itemSeparatorWidth);
        }
        return term;
      }
      function formatList(textArray) {
        return textArray.join("\n").replace(/^/gm, " ".repeat(itemIndentWidth));
      }
      let output = [`Usage: ${helper.commandUsage(cmd)}`, ""];
      const commandDescription = helper.commandDescription(cmd);
      if (commandDescription.length > 0) {
        output = output.concat([helper.wrap(commandDescription, helpWidth, 0), ""]);
      }
      const argumentList = helper.visibleArguments(cmd).map((argument) => {
        return formatItem(helper.argumentTerm(argument), helper.argumentDescription(argument));
      });
      if (argumentList.length > 0) {
        output = output.concat(["Arguments:", formatList(argumentList), ""]);
      }
      const optionList = helper.visibleOptions(cmd).map((option) => {
        return formatItem(helper.optionTerm(option), helper.optionDescription(option));
      });
      if (optionList.length > 0) {
        output = output.concat(["Options:", formatList(optionList), ""]);
      }
      if (this.showGlobalOptions) {
        const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
          return formatItem(helper.optionTerm(option), helper.optionDescription(option));
        });
        if (globalOptionList.length > 0) {
          output = output.concat(["Global Options:", formatList(globalOptionList), ""]);
        }
      }
      const commandList = helper.visibleCommands(cmd).map((cmd2) => {
        return formatItem(helper.subcommandTerm(cmd2), helper.subcommandDescription(cmd2));
      });
      if (commandList.length > 0) {
        output = output.concat(["Commands:", formatList(commandList), ""]);
      }
      return output.join("\n");
    }
    padWidth(cmd, helper) {
      return Math.max(helper.longestOptionTermLength(cmd, helper), helper.longestGlobalOptionTermLength(cmd, helper), helper.longestSubcommandTermLength(cmd, helper), helper.longestArgumentTermLength(cmd, helper));
    }
    wrap(str, width, indent, minColumnWidth = 40) {
      const indents = " \\f\\t\\v\xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF";
      const manualIndent = new RegExp(`[\\n][${indents}]+`);
      if (str.match(manualIndent))
        return str;
      const columnWidth = width - indent;
      if (columnWidth < minColumnWidth)
        return str;
      const leadingStr = str.slice(0, indent);
      const columnText = str.slice(indent).replace("\r\n", "\n");
      const indentString = " ".repeat(indent);
      const zeroWidthSpace = "\u200B";
      const breaks = `\\s${zeroWidthSpace}`;
      const regex = new RegExp(`\n|.{1,${columnWidth - 1}}([${breaks}]|\$)|[^${breaks}]+?([${breaks}]|\$)`, "g");
      const lines = columnText.match(regex) || [];
      return leadingStr + lines.map((line, i) => {
        if (line === "\n")
          return "";
        return (i > 0 ? indentString : "") + line.trimEnd();
      }).join("\n");
    }
  }
  exports.Help = Help;
});

// node_modules/commander/lib/option.js
var require_option = __commonJS((exports) => {
  function camelcase(str) {
    return str.split("-").reduce((str2, word) => {
      return str2 + word[0].toUpperCase() + word.slice(1);
    });
  }
  function splitOptionFlags(flags) {
    let shortFlag;
    let longFlag;
    const flagParts = flags.split(/[ |,]+/);
    if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1]))
      shortFlag = flagParts.shift();
    longFlag = flagParts.shift();
    if (!shortFlag && /^-[^-]$/.test(longFlag)) {
      shortFlag = longFlag;
      longFlag = undefined;
    }
    return { shortFlag, longFlag };
  }
  var { InvalidArgumentError } = require_error();

  class Option {
    constructor(flags, description) {
      this.flags = flags;
      this.description = description || "";
      this.required = flags.includes("<");
      this.optional = flags.includes("[");
      this.variadic = /\w\.\.\.[>\]]$/.test(flags);
      this.mandatory = false;
      const optionFlags = splitOptionFlags(flags);
      this.short = optionFlags.shortFlag;
      this.long = optionFlags.longFlag;
      this.negate = false;
      if (this.long) {
        this.negate = this.long.startsWith("--no-");
      }
      this.defaultValue = undefined;
      this.defaultValueDescription = undefined;
      this.presetArg = undefined;
      this.envVar = undefined;
      this.parseArg = undefined;
      this.hidden = false;
      this.argChoices = undefined;
      this.conflictsWith = [];
      this.implied = undefined;
    }
    default(value, description) {
      this.defaultValue = value;
      this.defaultValueDescription = description;
      return this;
    }
    preset(arg) {
      this.presetArg = arg;
      return this;
    }
    conflicts(names) {
      this.conflictsWith = this.conflictsWith.concat(names);
      return this;
    }
    implies(impliedOptionValues) {
      let newImplied = impliedOptionValues;
      if (typeof impliedOptionValues === "string") {
        newImplied = { [impliedOptionValues]: true };
      }
      this.implied = Object.assign(this.implied || {}, newImplied);
      return this;
    }
    env(name) {
      this.envVar = name;
      return this;
    }
    argParser(fn) {
      this.parseArg = fn;
      return this;
    }
    makeOptionMandatory(mandatory = true) {
      this.mandatory = !!mandatory;
      return this;
    }
    hideHelp(hide = true) {
      this.hidden = !!hide;
      return this;
    }
    _concatValue(value, previous) {
      if (previous === this.defaultValue || !Array.isArray(previous)) {
        return [value];
      }
      return previous.concat(value);
    }
    choices(values) {
      this.argChoices = values.slice();
      this.parseArg = (arg, previous) => {
        if (!this.argChoices.includes(arg)) {
          throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(", ")}.`);
        }
        if (this.variadic) {
          return this._concatValue(arg, previous);
        }
        return arg;
      };
      return this;
    }
    name() {
      if (this.long) {
        return this.long.replace(/^--/, "");
      }
      return this.short.replace(/^-/, "");
    }
    attributeName() {
      return camelcase(this.name().replace(/^no-/, ""));
    }
    is(arg) {
      return this.short === arg || this.long === arg;
    }
    isBoolean() {
      return !this.required && !this.optional && !this.negate;
    }
  }

  class DualOptions {
    constructor(options) {
      this.positiveOptions = new Map;
      this.negativeOptions = new Map;
      this.dualOptions = new Set;
      options.forEach((option) => {
        if (option.negate) {
          this.negativeOptions.set(option.attributeName(), option);
        } else {
          this.positiveOptions.set(option.attributeName(), option);
        }
      });
      this.negativeOptions.forEach((value, key) => {
        if (this.positiveOptions.has(key)) {
          this.dualOptions.add(key);
        }
      });
    }
    valueFromOption(value, option) {
      const optionKey = option.attributeName();
      if (!this.dualOptions.has(optionKey))
        return true;
      const preset = this.negativeOptions.get(optionKey).presetArg;
      const negativeValue = preset !== undefined ? preset : false;
      return option.negate === (negativeValue === value);
    }
  }
  exports.Option = Option;
  exports.DualOptions = DualOptions;
});

// node_modules/commander/lib/suggestSimilar.js
var require_suggestSimilar = __commonJS((exports) => {
  function editDistance(a, b) {
    if (Math.abs(a.length - b.length) > maxDistance)
      return Math.max(a.length, b.length);
    const d = [];
    for (let i = 0;i <= a.length; i++) {
      d[i] = [i];
    }
    for (let j = 0;j <= b.length; j++) {
      d[0][j] = j;
    }
    for (let j = 1;j <= b.length; j++) {
      for (let i = 1;i <= a.length; i++) {
        let cost = 1;
        if (a[i - 1] === b[j - 1]) {
          cost = 0;
        } else {
          cost = 1;
        }
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        }
      }
    }
    return d[a.length][b.length];
  }
  function suggestSimilar(word, candidates) {
    if (!candidates || candidates.length === 0)
      return "";
    candidates = Array.from(new Set(candidates));
    const searchingOptions = word.startsWith("--");
    if (searchingOptions) {
      word = word.slice(2);
      candidates = candidates.map((candidate) => candidate.slice(2));
    }
    let similar = [];
    let bestDistance = maxDistance;
    const minSimilarity = 0.4;
    candidates.forEach((candidate) => {
      if (candidate.length <= 1)
        return;
      const distance = editDistance(word, candidate);
      const length = Math.max(word.length, candidate.length);
      const similarity = (length - distance) / length;
      if (similarity > minSimilarity) {
        if (distance < bestDistance) {
          bestDistance = distance;
          similar = [candidate];
        } else if (distance === bestDistance) {
          similar.push(candidate);
        }
      }
    });
    similar.sort((a, b) => a.localeCompare(b));
    if (searchingOptions) {
      similar = similar.map((candidate) => `--${candidate}`);
    }
    if (similar.length > 1) {
      return `\n(Did you mean one of ${similar.join(", ")}?)`;
    }
    if (similar.length === 1) {
      return `\n(Did you mean ${similar[0]}?)`;
    }
    return "";
  }
  var maxDistance = 3;
  exports.suggestSimilar = suggestSimilar;
});

// node_modules/commander/lib/command.js
var require_command = __commonJS((exports) => {
  function incrementNodeInspectorPort(args) {
    return args.map((arg) => {
      if (!arg.startsWith("--inspect")) {
        return arg;
      }
      let debugOption;
      let debugHost = "127.0.0.1";
      let debugPort = "9229";
      let match;
      if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
        debugOption = match[1];
      } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
        debugOption = match[1];
        if (/^\d+$/.test(match[3])) {
          debugPort = match[3];
        } else {
          debugHost = match[3];
        }
      } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
        debugOption = match[1];
        debugHost = match[3];
        debugPort = match[4];
      }
      if (debugOption && debugPort !== "0") {
        return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
      }
      return arg;
    });
  }
  var EventEmitter = __require("events").EventEmitter;
  var childProcess = __require("child_process");
  var path = __require("path");
  var fs = __require("fs");
  var process2 = __require("process");
  var { Argument, humanReadableArgName } = require_argument();
  var { CommanderError } = require_error();
  var { Help } = require_help();
  var { Option, DualOptions } = require_option();
  var { suggestSimilar } = require_suggestSimilar();

  class Command extends EventEmitter {
    constructor(name) {
      super();
      this.commands = [];
      this.options = [];
      this.parent = null;
      this._allowUnknownOption = false;
      this._allowExcessArguments = true;
      this.registeredArguments = [];
      this._args = this.registeredArguments;
      this.args = [];
      this.rawArgs = [];
      this.processedArgs = [];
      this._scriptPath = null;
      this._name = name || "";
      this._optionValues = {};
      this._optionValueSources = {};
      this._storeOptionsAsProperties = false;
      this._actionHandler = null;
      this._executableHandler = false;
      this._executableFile = null;
      this._executableDir = null;
      this._defaultCommandName = null;
      this._exitCallback = null;
      this._aliases = [];
      this._combineFlagAndOptionalValue = true;
      this._description = "";
      this._summary = "";
      this._argsDescription = undefined;
      this._enablePositionalOptions = false;
      this._passThroughOptions = false;
      this._lifeCycleHooks = {};
      this._showHelpAfterError = false;
      this._showSuggestionAfterError = true;
      this._outputConfiguration = {
        writeOut: (str) => process2.stdout.write(str),
        writeErr: (str) => process2.stderr.write(str),
        getOutHelpWidth: () => process2.stdout.isTTY ? process2.stdout.columns : undefined,
        getErrHelpWidth: () => process2.stderr.isTTY ? process2.stderr.columns : undefined,
        outputError: (str, write) => write(str)
      };
      this._hidden = false;
      this._helpOption = undefined;
      this._addImplicitHelpCommand = undefined;
      this._helpCommand = undefined;
      this._helpConfiguration = {};
    }
    copyInheritedSettings(sourceCommand) {
      this._outputConfiguration = sourceCommand._outputConfiguration;
      this._helpOption = sourceCommand._helpOption;
      this._helpCommand = sourceCommand._helpCommand;
      this._helpConfiguration = sourceCommand._helpConfiguration;
      this._exitCallback = sourceCommand._exitCallback;
      this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
      this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
      this._allowExcessArguments = sourceCommand._allowExcessArguments;
      this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
      this._showHelpAfterError = sourceCommand._showHelpAfterError;
      this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
      return this;
    }
    _getCommandAndAncestors() {
      const result = [];
      for (let command = this;command; command = command.parent) {
        result.push(command);
      }
      return result;
    }
    command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
      let desc = actionOptsOrExecDesc;
      let opts = execOpts;
      if (typeof desc === "object" && desc !== null) {
        opts = desc;
        desc = null;
      }
      opts = opts || {};
      const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
      const cmd = this.createCommand(name);
      if (desc) {
        cmd.description(desc);
        cmd._executableHandler = true;
      }
      if (opts.isDefault)
        this._defaultCommandName = cmd._name;
      cmd._hidden = !!(opts.noHelp || opts.hidden);
      cmd._executableFile = opts.executableFile || null;
      if (args)
        cmd.arguments(args);
      this._registerCommand(cmd);
      cmd.parent = this;
      cmd.copyInheritedSettings(this);
      if (desc)
        return this;
      return cmd;
    }
    createCommand(name) {
      return new Command(name);
    }
    createHelp() {
      return Object.assign(new Help, this.configureHelp());
    }
    configureHelp(configuration) {
      if (configuration === undefined)
        return this._helpConfiguration;
      this._helpConfiguration = configuration;
      return this;
    }
    configureOutput(configuration) {
      if (configuration === undefined)
        return this._outputConfiguration;
      Object.assign(this._outputConfiguration, configuration);
      return this;
    }
    showHelpAfterError(displayHelp = true) {
      if (typeof displayHelp !== "string")
        displayHelp = !!displayHelp;
      this._showHelpAfterError = displayHelp;
      return this;
    }
    showSuggestionAfterError(displaySuggestion = true) {
      this._showSuggestionAfterError = !!displaySuggestion;
      return this;
    }
    addCommand(cmd, opts) {
      if (!cmd._name) {
        throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
      }
      opts = opts || {};
      if (opts.isDefault)
        this._defaultCommandName = cmd._name;
      if (opts.noHelp || opts.hidden)
        cmd._hidden = true;
      this._registerCommand(cmd);
      cmd.parent = this;
      cmd._checkForBrokenPassThrough();
      return this;
    }
    createArgument(name, description) {
      return new Argument(name, description);
    }
    argument(name, description, fn, defaultValue) {
      const argument = this.createArgument(name, description);
      if (typeof fn === "function") {
        argument.default(defaultValue).argParser(fn);
      } else {
        argument.default(fn);
      }
      this.addArgument(argument);
      return this;
    }
    arguments(names) {
      names.trim().split(/ +/).forEach((detail) => {
        this.argument(detail);
      });
      return this;
    }
    addArgument(argument) {
      const previousArgument = this.registeredArguments.slice(-1)[0];
      if (previousArgument && previousArgument.variadic) {
        throw new Error(`only the last argument can be variadic '${previousArgument.name()}'`);
      }
      if (argument.required && argument.defaultValue !== undefined && argument.parseArg === undefined) {
        throw new Error(`a default value for a required argument is never used: '${argument.name()}'`);
      }
      this.registeredArguments.push(argument);
      return this;
    }
    helpCommand(enableOrNameAndArgs, description) {
      if (typeof enableOrNameAndArgs === "boolean") {
        this._addImplicitHelpCommand = enableOrNameAndArgs;
        return this;
      }
      enableOrNameAndArgs = enableOrNameAndArgs ?? "help [command]";
      const [, helpName, helpArgs] = enableOrNameAndArgs.match(/([^ ]+) *(.*)/);
      const helpDescription = description ?? "display help for command";
      const helpCommand = this.createCommand(helpName);
      helpCommand.helpOption(false);
      if (helpArgs)
        helpCommand.arguments(helpArgs);
      if (helpDescription)
        helpCommand.description(helpDescription);
      this._addImplicitHelpCommand = true;
      this._helpCommand = helpCommand;
      return this;
    }
    addHelpCommand(helpCommand, deprecatedDescription) {
      if (typeof helpCommand !== "object") {
        this.helpCommand(helpCommand, deprecatedDescription);
        return this;
      }
      this._addImplicitHelpCommand = true;
      this._helpCommand = helpCommand;
      return this;
    }
    _getHelpCommand() {
      const hasImplicitHelpCommand = this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"));
      if (hasImplicitHelpCommand) {
        if (this._helpCommand === undefined) {
          this.helpCommand(undefined, undefined);
        }
        return this._helpCommand;
      }
      return null;
    }
    hook(event, listener) {
      const allowedValues = ["preSubcommand", "preAction", "postAction"];
      if (!allowedValues.includes(event)) {
        throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
      }
      if (this._lifeCycleHooks[event]) {
        this._lifeCycleHooks[event].push(listener);
      } else {
        this._lifeCycleHooks[event] = [listener];
      }
      return this;
    }
    exitOverride(fn) {
      if (fn) {
        this._exitCallback = fn;
      } else {
        this._exitCallback = (err) => {
          if (err.code !== "commander.executeSubCommandAsync") {
            throw err;
          } else {
          }
        };
      }
      return this;
    }
    _exit(exitCode, code, message) {
      if (this._exitCallback) {
        this._exitCallback(new CommanderError(exitCode, code, message));
      }
      process2.exit(exitCode);
    }
    action(fn) {
      const listener = (args) => {
        const expectedArgsCount = this.registeredArguments.length;
        const actionArgs = args.slice(0, expectedArgsCount);
        if (this._storeOptionsAsProperties) {
          actionArgs[expectedArgsCount] = this;
        } else {
          actionArgs[expectedArgsCount] = this.opts();
        }
        actionArgs.push(this);
        return fn.apply(this, actionArgs);
      };
      this._actionHandler = listener;
      return this;
    }
    createOption(flags, description) {
      return new Option(flags, description);
    }
    _callParseArg(target, value, previous, invalidArgumentMessage) {
      try {
        return target.parseArg(value, previous);
      } catch (err) {
        if (err.code === "commander.invalidArgument") {
          const message = `${invalidArgumentMessage} ${err.message}`;
          this.error(message, { exitCode: err.exitCode, code: err.code });
        }
        throw err;
      }
    }
    _registerOption(option) {
      const matchingOption = option.short && this._findOption(option.short) || option.long && this._findOption(option.long);
      if (matchingOption) {
        const matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
        throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
      }
      this.options.push(option);
    }
    _registerCommand(command) {
      const knownBy = (cmd) => {
        return [cmd.name()].concat(cmd.aliases());
      };
      const alreadyUsed = knownBy(command).find((name) => this._findCommand(name));
      if (alreadyUsed) {
        const existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|");
        const newCmd = knownBy(command).join("|");
        throw new Error(`cannot add command '${newCmd}' as already have command '${existingCmd}'`);
      }
      this.commands.push(command);
    }
    addOption(option) {
      this._registerOption(option);
      const oname = option.name();
      const name = option.attributeName();
      if (option.negate) {
        const positiveLongFlag = option.long.replace(/^--no-/, "--");
        if (!this._findOption(positiveLongFlag)) {
          this.setOptionValueWithSource(name, option.defaultValue === undefined ? true : option.defaultValue, "default");
        }
      } else if (option.defaultValue !== undefined) {
        this.setOptionValueWithSource(name, option.defaultValue, "default");
      }
      const handleOptionValue = (val, invalidValueMessage, valueSource) => {
        if (val == null && option.presetArg !== undefined) {
          val = option.presetArg;
        }
        const oldValue = this.getOptionValue(name);
        if (val !== null && option.parseArg) {
          val = this._callParseArg(option, val, oldValue, invalidValueMessage);
        } else if (val !== null && option.variadic) {
          val = option._concatValue(val, oldValue);
        }
        if (val == null) {
          if (option.negate) {
            val = false;
          } else if (option.isBoolean() || option.optional) {
            val = true;
          } else {
            val = "";
          }
        }
        this.setOptionValueWithSource(name, val, valueSource);
      };
      this.on("option:" + oname, (val) => {
        const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
        handleOptionValue(val, invalidValueMessage, "cli");
      });
      if (option.envVar) {
        this.on("optionEnv:" + oname, (val) => {
          const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
          handleOptionValue(val, invalidValueMessage, "env");
        });
      }
      return this;
    }
    _optionEx(config, flags, description, fn, defaultValue) {
      if (typeof flags === "object" && flags instanceof Option) {
        throw new Error("To add an Option object use addOption() instead of option() or requiredOption()");
      }
      const option = this.createOption(flags, description);
      option.makeOptionMandatory(!!config.mandatory);
      if (typeof fn === "function") {
        option.default(defaultValue).argParser(fn);
      } else if (fn instanceof RegExp) {
        const regex = fn;
        fn = (val, def) => {
          const m = regex.exec(val);
          return m ? m[0] : def;
        };
        option.default(defaultValue).argParser(fn);
      } else {
        option.default(fn);
      }
      return this.addOption(option);
    }
    option(flags, description, parseArg, defaultValue) {
      return this._optionEx({}, flags, description, parseArg, defaultValue);
    }
    requiredOption(flags, description, parseArg, defaultValue) {
      return this._optionEx({ mandatory: true }, flags, description, parseArg, defaultValue);
    }
    combineFlagAndOptionalValue(combine = true) {
      this._combineFlagAndOptionalValue = !!combine;
      return this;
    }
    allowUnknownOption(allowUnknown = true) {
      this._allowUnknownOption = !!allowUnknown;
      return this;
    }
    allowExcessArguments(allowExcess = true) {
      this._allowExcessArguments = !!allowExcess;
      return this;
    }
    enablePositionalOptions(positional = true) {
      this._enablePositionalOptions = !!positional;
      return this;
    }
    passThroughOptions(passThrough = true) {
      this._passThroughOptions = !!passThrough;
      this._checkForBrokenPassThrough();
      return this;
    }
    _checkForBrokenPassThrough() {
      if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) {
        throw new Error(`passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`);
      }
    }
    storeOptionsAsProperties(storeAsProperties = true) {
      if (this.options.length) {
        throw new Error("call .storeOptionsAsProperties() before adding options");
      }
      if (Object.keys(this._optionValues).length) {
        throw new Error("call .storeOptionsAsProperties() before setting option values");
      }
      this._storeOptionsAsProperties = !!storeAsProperties;
      return this;
    }
    getOptionValue(key) {
      if (this._storeOptionsAsProperties) {
        return this[key];
      }
      return this._optionValues[key];
    }
    setOptionValue(key, value) {
      return this.setOptionValueWithSource(key, value, undefined);
    }
    setOptionValueWithSource(key, value, source) {
      if (this._storeOptionsAsProperties) {
        this[key] = value;
      } else {
        this._optionValues[key] = value;
      }
      this._optionValueSources[key] = source;
      return this;
    }
    getOptionValueSource(key) {
      return this._optionValueSources[key];
    }
    getOptionValueSourceWithGlobals(key) {
      let source;
      this._getCommandAndAncestors().forEach((cmd) => {
        if (cmd.getOptionValueSource(key) !== undefined) {
          source = cmd.getOptionValueSource(key);
        }
      });
      return source;
    }
    _prepareUserArgs(argv, parseOptions) {
      if (argv !== undefined && !Array.isArray(argv)) {
        throw new Error("first parameter to parse must be array or undefined");
      }
      parseOptions = parseOptions || {};
      if (argv === undefined) {
        argv = process2.argv;
        if (process2.versions && process2.versions.electron) {
          parseOptions.from = "electron";
        }
      }
      this.rawArgs = argv.slice();
      let userArgs;
      switch (parseOptions.from) {
        case undefined:
        case "node":
          this._scriptPath = argv[1];
          userArgs = argv.slice(2);
          break;
        case "electron":
          if (process2.defaultApp) {
            this._scriptPath = argv[1];
            userArgs = argv.slice(2);
          } else {
            userArgs = argv.slice(1);
          }
          break;
        case "user":
          userArgs = argv.slice(0);
          break;
        default:
          throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
      }
      if (!this._name && this._scriptPath)
        this.nameFromFilename(this._scriptPath);
      this._name = this._name || "program";
      return userArgs;
    }
    parse(argv, parseOptions) {
      const userArgs = this._prepareUserArgs(argv, parseOptions);
      this._parseCommand([], userArgs);
      return this;
    }
    async parseAsync(argv, parseOptions) {
      const userArgs = this._prepareUserArgs(argv, parseOptions);
      await this._parseCommand([], userArgs);
      return this;
    }
    _executeSubCommand(subcommand, args) {
      args = args.slice();
      let launchWithNode = false;
      const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
      function findFile(baseDir, baseName) {
        const localBin = path.resolve(baseDir, baseName);
        if (fs.existsSync(localBin))
          return localBin;
        if (sourceExt.includes(path.extname(baseName)))
          return;
        const foundExt = sourceExt.find((ext) => fs.existsSync(`${localBin}${ext}`));
        if (foundExt)
          return `${localBin}${foundExt}`;
        return;
      }
      this._checkForMissingMandatoryOptions();
      this._checkForConflictingOptions();
      let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
      let executableDir = this._executableDir || "";
      if (this._scriptPath) {
        let resolvedScriptPath;
        try {
          resolvedScriptPath = fs.realpathSync(this._scriptPath);
        } catch (err) {
          resolvedScriptPath = this._scriptPath;
        }
        executableDir = path.resolve(path.dirname(resolvedScriptPath), executableDir);
      }
      if (executableDir) {
        let localFile = findFile(executableDir, executableFile);
        if (!localFile && !subcommand._executableFile && this._scriptPath) {
          const legacyName = path.basename(this._scriptPath, path.extname(this._scriptPath));
          if (legacyName !== this._name) {
            localFile = findFile(executableDir, `${legacyName}-${subcommand._name}`);
          }
        }
        executableFile = localFile || executableFile;
      }
      launchWithNode = sourceExt.includes(path.extname(executableFile));
      let proc;
      if (process2.platform !== "win32") {
        if (launchWithNode) {
          args.unshift(executableFile);
          args = incrementNodeInspectorPort(process2.execArgv).concat(args);
          proc = childProcess.spawn(process2.argv[0], args, { stdio: "inherit" });
        } else {
          proc = childProcess.spawn(executableFile, args, { stdio: "inherit" });
        }
      } else {
        args.unshift(executableFile);
        args = incrementNodeInspectorPort(process2.execArgv).concat(args);
        proc = childProcess.spawn(process2.execPath, args, { stdio: "inherit" });
      }
      if (!proc.killed) {
        const signals = ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"];
        signals.forEach((signal) => {
          process2.on(signal, () => {
            if (proc.killed === false && proc.exitCode === null) {
              proc.kill(signal);
            }
          });
        });
      }
      const exitCallback = this._exitCallback;
      proc.on("close", (code, _signal) => {
        code = code ?? 1;
        if (!exitCallback) {
          process2.exit(code);
        } else {
          exitCallback(new CommanderError(code, "commander.executeSubCommandAsync", "(close)"));
        }
      });
      proc.on("error", (err) => {
        if (err.code === "ENOENT") {
          const executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
          const executableMissing = `'${executableFile}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
          throw new Error(executableMissing);
        } else if (err.code === "EACCES") {
          throw new Error(`'${executableFile}' not executable`);
        }
        if (!exitCallback) {
          process2.exit(1);
        } else {
          const wrappedError = new CommanderError(1, "commander.executeSubCommandAsync", "(error)");
          wrappedError.nestedError = err;
          exitCallback(wrappedError);
        }
      });
      this.runningCommand = proc;
    }
    _dispatchSubcommand(commandName, operands, unknown) {
      const subCommand = this._findCommand(commandName);
      if (!subCommand)
        this.help({ error: true });
      let promiseChain;
      promiseChain = this._chainOrCallSubCommandHook(promiseChain, subCommand, "preSubcommand");
      promiseChain = this._chainOrCall(promiseChain, () => {
        if (subCommand._executableHandler) {
          this._executeSubCommand(subCommand, operands.concat(unknown));
        } else {
          return subCommand._parseCommand(operands, unknown);
        }
      });
      return promiseChain;
    }
    _dispatchHelpCommand(subcommandName) {
      if (!subcommandName) {
        this.help();
      }
      const subCommand = this._findCommand(subcommandName);
      if (subCommand && !subCommand._executableHandler) {
        subCommand.help();
      }
      return this._dispatchSubcommand(subcommandName, [], [
        this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"
      ]);
    }
    _checkNumberOfArguments() {
      this.registeredArguments.forEach((arg, i) => {
        if (arg.required && this.args[i] == null) {
          this.missingArgument(arg.name());
        }
      });
      if (this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) {
        return;
      }
      if (this.args.length > this.registeredArguments.length) {
        this._excessArguments(this.args);
      }
    }
    _processArguments() {
      const myParseArg = (argument, value, previous) => {
        let parsedValue = value;
        if (value !== null && argument.parseArg) {
          const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
          parsedValue = this._callParseArg(argument, value, previous, invalidValueMessage);
        }
        return parsedValue;
      };
      this._checkNumberOfArguments();
      const processedArgs = [];
      this.registeredArguments.forEach((declaredArg, index) => {
        let value = declaredArg.defaultValue;
        if (declaredArg.variadic) {
          if (index < this.args.length) {
            value = this.args.slice(index);
            if (declaredArg.parseArg) {
              value = value.reduce((processed, v) => {
                return myParseArg(declaredArg, v, processed);
              }, declaredArg.defaultValue);
            }
          } else if (value === undefined) {
            value = [];
          }
        } else if (index < this.args.length) {
          value = this.args[index];
          if (declaredArg.parseArg) {
            value = myParseArg(declaredArg, value, declaredArg.defaultValue);
          }
        }
        processedArgs[index] = value;
      });
      this.processedArgs = processedArgs;
    }
    _chainOrCall(promise, fn) {
      if (promise && promise.then && typeof promise.then === "function") {
        return promise.then(() => fn());
      }
      return fn();
    }
    _chainOrCallHooks(promise, event) {
      let result = promise;
      const hooks = [];
      this._getCommandAndAncestors().reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== undefined).forEach((hookedCommand) => {
        hookedCommand._lifeCycleHooks[event].forEach((callback) => {
          hooks.push({ hookedCommand, callback });
        });
      });
      if (event === "postAction") {
        hooks.reverse();
      }
      hooks.forEach((hookDetail) => {
        result = this._chainOrCall(result, () => {
          return hookDetail.callback(hookDetail.hookedCommand, this);
        });
      });
      return result;
    }
    _chainOrCallSubCommandHook(promise, subCommand, event) {
      let result = promise;
      if (this._lifeCycleHooks[event] !== undefined) {
        this._lifeCycleHooks[event].forEach((hook) => {
          result = this._chainOrCall(result, () => {
            return hook(this, subCommand);
          });
        });
      }
      return result;
    }
    _parseCommand(operands, unknown) {
      const parsed = this.parseOptions(unknown);
      this._parseOptionsEnv();
      this._parseOptionsImplied();
      operands = operands.concat(parsed.operands);
      unknown = parsed.unknown;
      this.args = operands.concat(unknown);
      if (operands && this._findCommand(operands[0])) {
        return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
      }
      if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) {
        return this._dispatchHelpCommand(operands[1]);
      }
      if (this._defaultCommandName) {
        this._outputHelpIfRequested(unknown);
        return this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
      }
      if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
        this.help({ error: true });
      }
      this._outputHelpIfRequested(parsed.unknown);
      this._checkForMissingMandatoryOptions();
      this._checkForConflictingOptions();
      const checkForUnknownOptions = () => {
        if (parsed.unknown.length > 0) {
          this.unknownOption(parsed.unknown[0]);
        }
      };
      const commandEvent = `command:${this.name()}`;
      if (this._actionHandler) {
        checkForUnknownOptions();
        this._processArguments();
        let promiseChain;
        promiseChain = this._chainOrCallHooks(promiseChain, "preAction");
        promiseChain = this._chainOrCall(promiseChain, () => this._actionHandler(this.processedArgs));
        if (this.parent) {
          promiseChain = this._chainOrCall(promiseChain, () => {
            this.parent.emit(commandEvent, operands, unknown);
          });
        }
        promiseChain = this._chainOrCallHooks(promiseChain, "postAction");
        return promiseChain;
      }
      if (this.parent && this.parent.listenerCount(commandEvent)) {
        checkForUnknownOptions();
        this._processArguments();
        this.parent.emit(commandEvent, operands, unknown);
      } else if (operands.length) {
        if (this._findCommand("*")) {
          return this._dispatchSubcommand("*", operands, unknown);
        }
        if (this.listenerCount("command:*")) {
          this.emit("command:*", operands, unknown);
        } else if (this.commands.length) {
          this.unknownCommand();
        } else {
          checkForUnknownOptions();
          this._processArguments();
        }
      } else if (this.commands.length) {
        checkForUnknownOptions();
        this.help({ error: true });
      } else {
        checkForUnknownOptions();
        this._processArguments();
      }
    }
    _findCommand(name) {
      if (!name)
        return;
      return this.commands.find((cmd) => cmd._name === name || cmd._aliases.includes(name));
    }
    _findOption(arg) {
      return this.options.find((option) => option.is(arg));
    }
    _checkForMissingMandatoryOptions() {
      this._getCommandAndAncestors().forEach((cmd) => {
        cmd.options.forEach((anOption) => {
          if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === undefined) {
            cmd.missingMandatoryOptionValue(anOption);
          }
        });
      });
    }
    _checkForConflictingLocalOptions() {
      const definedNonDefaultOptions = this.options.filter((option) => {
        const optionKey = option.attributeName();
        if (this.getOptionValue(optionKey) === undefined) {
          return false;
        }
        return this.getOptionValueSource(optionKey) !== "default";
      });
      const optionsWithConflicting = definedNonDefaultOptions.filter((option) => option.conflictsWith.length > 0);
      optionsWithConflicting.forEach((option) => {
        const conflictingAndDefined = definedNonDefaultOptions.find((defined) => option.conflictsWith.includes(defined.attributeName()));
        if (conflictingAndDefined) {
          this._conflictingOption(option, conflictingAndDefined);
        }
      });
    }
    _checkForConflictingOptions() {
      this._getCommandAndAncestors().forEach((cmd) => {
        cmd._checkForConflictingLocalOptions();
      });
    }
    parseOptions(argv) {
      const operands = [];
      const unknown = [];
      let dest = operands;
      const args = argv.slice();
      function maybeOption(arg) {
        return arg.length > 1 && arg[0] === "-";
      }
      let activeVariadicOption = null;
      while (args.length) {
        const arg = args.shift();
        if (arg === "--") {
          if (dest === unknown)
            dest.push(arg);
          dest.push(...args);
          break;
        }
        if (activeVariadicOption && !maybeOption(arg)) {
          this.emit(`option:${activeVariadicOption.name()}`, arg);
          continue;
        }
        activeVariadicOption = null;
        if (maybeOption(arg)) {
          const option = this._findOption(arg);
          if (option) {
            if (option.required) {
              const value = args.shift();
              if (value === undefined)
                this.optionMissingArgument(option);
              this.emit(`option:${option.name()}`, value);
            } else if (option.optional) {
              let value = null;
              if (args.length > 0 && !maybeOption(args[0])) {
                value = args.shift();
              }
              this.emit(`option:${option.name()}`, value);
            } else {
              this.emit(`option:${option.name()}`);
            }
            activeVariadicOption = option.variadic ? option : null;
            continue;
          }
        }
        if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
          const option = this._findOption(`-${arg[1]}`);
          if (option) {
            if (option.required || option.optional && this._combineFlagAndOptionalValue) {
              this.emit(`option:${option.name()}`, arg.slice(2));
            } else {
              this.emit(`option:${option.name()}`);
              args.unshift(`-${arg.slice(2)}`);
            }
            continue;
          }
        }
        if (/^--[^=]+=/.test(arg)) {
          const index = arg.indexOf("=");
          const option = this._findOption(arg.slice(0, index));
          if (option && (option.required || option.optional)) {
            this.emit(`option:${option.name()}`, arg.slice(index + 1));
            continue;
          }
        }
        if (maybeOption(arg)) {
          dest = unknown;
        }
        if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
          if (this._findCommand(arg)) {
            operands.push(arg);
            if (args.length > 0)
              unknown.push(...args);
            break;
          } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
            operands.push(arg);
            if (args.length > 0)
              operands.push(...args);
            break;
          } else if (this._defaultCommandName) {
            unknown.push(arg);
            if (args.length > 0)
              unknown.push(...args);
            break;
          }
        }
        if (this._passThroughOptions) {
          dest.push(arg);
          if (args.length > 0)
            dest.push(...args);
          break;
        }
        dest.push(arg);
      }
      return { operands, unknown };
    }
    opts() {
      if (this._storeOptionsAsProperties) {
        const result = {};
        const len = this.options.length;
        for (let i = 0;i < len; i++) {
          const key = this.options[i].attributeName();
          result[key] = key === this._versionOptionName ? this._version : this[key];
        }
        return result;
      }
      return this._optionValues;
    }
    optsWithGlobals() {
      return this._getCommandAndAncestors().reduce((combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()), {});
    }
    error(message, errorOptions) {
      this._outputConfiguration.outputError(`${message}\n`, this._outputConfiguration.writeErr);
      if (typeof this._showHelpAfterError === "string") {
        this._outputConfiguration.writeErr(`${this._showHelpAfterError}\n`);
      } else if (this._showHelpAfterError) {
        this._outputConfiguration.writeErr("\n");
        this.outputHelp({ error: true });
      }
      const config = errorOptions || {};
      const exitCode = config.exitCode || 1;
      const code = config.code || "commander.error";
      this._exit(exitCode, code, message);
    }
    _parseOptionsEnv() {
      this.options.forEach((option) => {
        if (option.envVar && option.envVar in process2.env) {
          const optionKey = option.attributeName();
          if (this.getOptionValue(optionKey) === undefined || ["default", "config", "env"].includes(this.getOptionValueSource(optionKey))) {
            if (option.required || option.optional) {
              this.emit(`optionEnv:${option.name()}`, process2.env[option.envVar]);
            } else {
              this.emit(`optionEnv:${option.name()}`);
            }
          }
        }
      });
    }
    _parseOptionsImplied() {
      const dualHelper = new DualOptions(this.options);
      const hasCustomOptionValue = (optionKey) => {
        return this.getOptionValue(optionKey) !== undefined && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
      };
      this.options.filter((option) => option.implied !== undefined && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(this.getOptionValue(option.attributeName()), option)).forEach((option) => {
        Object.keys(option.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
          this.setOptionValueWithSource(impliedKey, option.implied[impliedKey], "implied");
        });
      });
    }
    missingArgument(name) {
      const message = `error: missing required argument '${name}'`;
      this.error(message, { code: "commander.missingArgument" });
    }
    optionMissingArgument(option) {
      const message = `error: option '${option.flags}' argument missing`;
      this.error(message, { code: "commander.optionMissingArgument" });
    }
    missingMandatoryOptionValue(option) {
      const message = `error: required option '${option.flags}' not specified`;
      this.error(message, { code: "commander.missingMandatoryOptionValue" });
    }
    _conflictingOption(option, conflictingOption) {
      const findBestOptionFromValue = (option2) => {
        const optionKey = option2.attributeName();
        const optionValue = this.getOptionValue(optionKey);
        const negativeOption = this.options.find((target) => target.negate && optionKey === target.attributeName());
        const positiveOption = this.options.find((target) => !target.negate && optionKey === target.attributeName());
        if (negativeOption && (negativeOption.presetArg === undefined && optionValue === false || negativeOption.presetArg !== undefined && optionValue === negativeOption.presetArg)) {
          return negativeOption;
        }
        return positiveOption || option2;
      };
      const getErrorMessage = (option2) => {
        const bestOption = findBestOptionFromValue(option2);
        const optionKey = bestOption.attributeName();
        const source = this.getOptionValueSource(optionKey);
        if (source === "env") {
          return `environment variable '${bestOption.envVar}'`;
        }
        return `option '${bestOption.flags}'`;
      };
      const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
      this.error(message, { code: "commander.conflictingOption" });
    }
    unknownOption(flag) {
      if (this._allowUnknownOption)
        return;
      let suggestion = "";
      if (flag.startsWith("--") && this._showSuggestionAfterError) {
        let candidateFlags = [];
        let command = this;
        do {
          const moreFlags = command.createHelp().visibleOptions(command).filter((option) => option.long).map((option) => option.long);
          candidateFlags = candidateFlags.concat(moreFlags);
          command = command.parent;
        } while (command && !command._enablePositionalOptions);
        suggestion = suggestSimilar(flag, candidateFlags);
      }
      const message = `error: unknown option '${flag}'${suggestion}`;
      this.error(message, { code: "commander.unknownOption" });
    }
    _excessArguments(receivedArgs) {
      if (this._allowExcessArguments)
        return;
      const expected = this.registeredArguments.length;
      const s = expected === 1 ? "" : "s";
      const forSubcommand = this.parent ? ` for '${this.name()}'` : "";
      const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
      this.error(message, { code: "commander.excessArguments" });
    }
    unknownCommand() {
      const unknownName = this.args[0];
      let suggestion = "";
      if (this._showSuggestionAfterError) {
        const candidateNames = [];
        this.createHelp().visibleCommands(this).forEach((command) => {
          candidateNames.push(command.name());
          if (command.alias())
            candidateNames.push(command.alias());
        });
        suggestion = suggestSimilar(unknownName, candidateNames);
      }
      const message = `error: unknown command '${unknownName}'${suggestion}`;
      this.error(message, { code: "commander.unknownCommand" });
    }
    version(str, flags, description) {
      if (str === undefined)
        return this._version;
      this._version = str;
      flags = flags || "-V, --version";
      description = description || "output the version number";
      const versionOption = this.createOption(flags, description);
      this._versionOptionName = versionOption.attributeName();
      this._registerOption(versionOption);
      this.on("option:" + versionOption.name(), () => {
        this._outputConfiguration.writeOut(`${str}\n`);
        this._exit(0, "commander.version", str);
      });
      return this;
    }
    description(str, argsDescription) {
      if (str === undefined && argsDescription === undefined)
        return this._description;
      this._description = str;
      if (argsDescription) {
        this._argsDescription = argsDescription;
      }
      return this;
    }
    summary(str) {
      if (str === undefined)
        return this._summary;
      this._summary = str;
      return this;
    }
    alias(alias) {
      if (alias === undefined)
        return this._aliases[0];
      let command = this;
      if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
        command = this.commands[this.commands.length - 1];
      }
      if (alias === command._name)
        throw new Error("Command alias can\'t be the same as its name");
      const matchingCommand = this.parent?._findCommand(alias);
      if (matchingCommand) {
        const existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join("|");
        throw new Error(`cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`);
      }
      command._aliases.push(alias);
      return this;
    }
    aliases(aliases) {
      if (aliases === undefined)
        return this._aliases;
      aliases.forEach((alias) => this.alias(alias));
      return this;
    }
    usage(str) {
      if (str === undefined) {
        if (this._usage)
          return this._usage;
        const args = this.registeredArguments.map((arg) => {
          return humanReadableArgName(arg);
        });
        return [].concat(this.options.length || this._helpOption !== null ? "[options]" : [], this.commands.length ? "[command]" : [], this.registeredArguments.length ? args : []).join(" ");
      }
      this._usage = str;
      return this;
    }
    name(str) {
      if (str === undefined)
        return this._name;
      this._name = str;
      return this;
    }
    nameFromFilename(filename) {
      this._name = path.basename(filename, path.extname(filename));
      return this;
    }
    executableDir(path2) {
      if (path2 === undefined)
        return this._executableDir;
      this._executableDir = path2;
      return this;
    }
    helpInformation(contextOptions) {
      const helper = this.createHelp();
      if (helper.helpWidth === undefined) {
        helper.helpWidth = contextOptions && contextOptions.error ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
      }
      return helper.formatHelp(this, helper);
    }
    _getHelpContext(contextOptions) {
      contextOptions = contextOptions || {};
      const context = { error: !!contextOptions.error };
      let write;
      if (context.error) {
        write = (arg) => this._outputConfiguration.writeErr(arg);
      } else {
        write = (arg) => this._outputConfiguration.writeOut(arg);
      }
      context.write = contextOptions.write || write;
      context.command = this;
      return context;
    }
    outputHelp(contextOptions) {
      let deprecatedCallback;
      if (typeof contextOptions === "function") {
        deprecatedCallback = contextOptions;
        contextOptions = undefined;
      }
      const context = this._getHelpContext(contextOptions);
      this._getCommandAndAncestors().reverse().forEach((command) => command.emit("beforeAllHelp", context));
      this.emit("beforeHelp", context);
      let helpInformation = this.helpInformation(context);
      if (deprecatedCallback) {
        helpInformation = deprecatedCallback(helpInformation);
        if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) {
          throw new Error("outputHelp callback must return a string or a Buffer");
        }
      }
      context.write(helpInformation);
      if (this._getHelpOption()?.long) {
        this.emit(this._getHelpOption().long);
      }
      this.emit("afterHelp", context);
      this._getCommandAndAncestors().forEach((command) => command.emit("afterAllHelp", context));
    }
    helpOption(flags, description) {
      if (typeof flags === "boolean") {
        if (flags) {
          this._helpOption = this._helpOption ?? undefined;
        } else {
          this._helpOption = null;
        }
        return this;
      }
      flags = flags ?? "-h, --help";
      description = description ?? "display help for command";
      this._helpOption = this.createOption(flags, description);
      return this;
    }
    _getHelpOption() {
      if (this._helpOption === undefined) {
        this.helpOption(undefined, undefined);
      }
      return this._helpOption;
    }
    addHelpOption(option) {
      this._helpOption = option;
      return this;
    }
    help(contextOptions) {
      this.outputHelp(contextOptions);
      let exitCode = process2.exitCode || 0;
      if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) {
        exitCode = 1;
      }
      this._exit(exitCode, "commander.help", "(outputHelp)");
    }
    addHelpText(position, text) {
      const allowedValues = ["beforeAll", "before", "after", "afterAll"];
      if (!allowedValues.includes(position)) {
        throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
      }
      const helpEvent = `${position}Help`;
      this.on(helpEvent, (context) => {
        let helpStr;
        if (typeof text === "function") {
          helpStr = text({ error: context.error, command: context.command });
        } else {
          helpStr = text;
        }
        if (helpStr) {
          context.write(`${helpStr}\n`);
        }
      });
      return this;
    }
    _outputHelpIfRequested(args) {
      const helpOption = this._getHelpOption();
      const helpRequested = helpOption && args.find((arg) => helpOption.is(arg));
      if (helpRequested) {
        this.outputHelp();
        this._exit(0, "commander.helpDisplayed", "(outputHelp)");
      }
    }
  }
  exports.Command = Command;
});

// node_modules/commander/index.js
var require_commander = __commonJS((exports) => {
  var { Argument } = require_argument();
  var { Command } = require_command();
  var { CommanderError, InvalidArgumentError } = require_error();
  var { Help } = require_help();
  var { Option } = require_option();
  exports.program = new Command;
  exports.createCommand = (name) => new Command(name);
  exports.createOption = (flags, description) => new Option(flags, description);
  exports.createArgument = (name, description) => new Argument(name, description);
  exports.Command = Command;
  exports.Option = Option;
  exports.Argument = Argument;
  exports.Help = Help;
  exports.CommanderError = CommanderError;
  exports.InvalidArgumentError = InvalidArgumentError;
  exports.InvalidOptionArgumentError = InvalidArgumentError;
});

// node_modules/kleur/index.js
var require_kleur = __commonJS((exports, module) => {
  function run(arr, str) {
    let i = 0, tmp, beg = "", end = "";
    for (;i < arr.length; i++) {
      tmp = arr[i];
      beg += tmp.open;
      end += tmp.close;
      if (str.includes(tmp.close)) {
        str = str.replace(tmp.rgx, tmp.close + tmp.open);
      }
    }
    return beg + str + end;
  }
  function chain(has, keys) {
    let ctx = { has, keys };
    ctx.reset = $.reset.bind(ctx);
    ctx.bold = $.bold.bind(ctx);
    ctx.dim = $.dim.bind(ctx);
    ctx.italic = $.italic.bind(ctx);
    ctx.underline = $.underline.bind(ctx);
    ctx.inverse = $.inverse.bind(ctx);
    ctx.hidden = $.hidden.bind(ctx);
    ctx.strikethrough = $.strikethrough.bind(ctx);
    ctx.black = $.black.bind(ctx);
    ctx.red = $.red.bind(ctx);
    ctx.green = $.green.bind(ctx);
    ctx.yellow = $.yellow.bind(ctx);
    ctx.blue = $.blue.bind(ctx);
    ctx.magenta = $.magenta.bind(ctx);
    ctx.cyan = $.cyan.bind(ctx);
    ctx.white = $.white.bind(ctx);
    ctx.gray = $.gray.bind(ctx);
    ctx.grey = $.grey.bind(ctx);
    ctx.bgBlack = $.bgBlack.bind(ctx);
    ctx.bgRed = $.bgRed.bind(ctx);
    ctx.bgGreen = $.bgGreen.bind(ctx);
    ctx.bgYellow = $.bgYellow.bind(ctx);
    ctx.bgBlue = $.bgBlue.bind(ctx);
    ctx.bgMagenta = $.bgMagenta.bind(ctx);
    ctx.bgCyan = $.bgCyan.bind(ctx);
    ctx.bgWhite = $.bgWhite.bind(ctx);
    return ctx;
  }
  function init(open, close) {
    let blk = {
      open: `\x1B[${open}m`,
      close: `\x1B[${close}m`,
      rgx: new RegExp(`\\x1b\\[${close}m`, "g")
    };
    return function(txt) {
      if (this !== undefined && this.has !== undefined) {
        this.has.includes(open) || (this.has.push(open), this.keys.push(blk));
        return txt === undefined ? this : $.enabled ? run(this.keys, txt + "") : txt + "";
      }
      return txt === undefined ? chain([open], [blk]) : $.enabled ? run([blk], txt + "") : txt + "";
    };
  }
  var { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = process.env;
  var $ = {
    enabled: !NODE_DISABLE_COLORS && TERM !== "dumb" && FORCE_COLOR !== "0",
    reset: init(0, 0),
    bold: init(1, 22),
    dim: init(2, 22),
    italic: init(3, 23),
    underline: init(4, 24),
    inverse: init(7, 27),
    hidden: init(8, 28),
    strikethrough: init(9, 29),
    black: init(30, 39),
    red: init(31, 39),
    green: init(32, 39),
    yellow: init(33, 39),
    blue: init(34, 39),
    magenta: init(35, 39),
    cyan: init(36, 39),
    white: init(37, 39),
    gray: init(90, 39),
    grey: init(90, 39),
    bgBlack: init(40, 49),
    bgRed: init(41, 49),
    bgGreen: init(42, 49),
    bgYellow: init(43, 49),
    bgBlue: init(44, 49),
    bgMagenta: init(45, 49),
    bgCyan: init(46, 49),
    bgWhite: init(47, 49)
  };
  module.exports = $;
});

// node_modules/prompts/dist/util/action.js
var require_action = __commonJS((exports, module) => {
  module.exports = (key, isSelect) => {
    if (key.meta && key.name !== "escape")
      return;
    if (key.ctrl) {
      if (key.name === "a")
        return "first";
      if (key.name === "c")
        return "abort";
      if (key.name === "d")
        return "abort";
      if (key.name === "e")
        return "last";
      if (key.name === "g")
        return "reset";
    }
    if (isSelect) {
      if (key.name === "j")
        return "down";
      if (key.name === "k")
        return "up";
    }
    if (key.name === "return")
      return "submit";
    if (key.name === "enter")
      return "submit";
    if (key.name === "backspace")
      return "delete";
    if (key.name === "delete")
      return "deleteForward";
    if (key.name === "abort")
      return "abort";
    if (key.name === "escape")
      return "exit";
    if (key.name === "tab")
      return "next";
    if (key.name === "pagedown")
      return "nextPage";
    if (key.name === "pageup")
      return "prevPage";
    if (key.name === "home")
      return "home";
    if (key.name === "end")
      return "end";
    if (key.name === "up")
      return "up";
    if (key.name === "down")
      return "down";
    if (key.name === "right")
      return "right";
    if (key.name === "left")
      return "left";
    return false;
  };
});

// node_modules/prompts/dist/util/strip.js
var require_strip = __commonJS((exports, module) => {
  module.exports = (str) => {
    const pattern = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"].join("|");
    const RGX = new RegExp(pattern, "g");
    return typeof str === "string" ? str.replace(RGX, "") : str;
  };
});

// node_modules/sisteransi/src/index.js
var require_src = __commonJS((exports, module) => {
  var ESC = "\x1B";
  var CSI = `${ESC}[`;
  var beep = "\x07";
  var cursor = {
    to(x, y) {
      if (!y)
        return `${CSI}${x + 1}G`;
      return `${CSI}${y + 1};${x + 1}H`;
    },
    move(x, y) {
      let ret = "";
      if (x < 0)
        ret += `${CSI}${-x}D`;
      else if (x > 0)
        ret += `${CSI}${x}C`;
      if (y < 0)
        ret += `${CSI}${-y}A`;
      else if (y > 0)
        ret += `${CSI}${y}B`;
      return ret;
    },
    up: (count = 1) => `${CSI}${count}A`,
    down: (count = 1) => `${CSI}${count}B`,
    forward: (count = 1) => `${CSI}${count}C`,
    backward: (count = 1) => `${CSI}${count}D`,
    nextLine: (count = 1) => `${CSI}E`.repeat(count),
    prevLine: (count = 1) => `${CSI}F`.repeat(count),
    left: `${CSI}G`,
    hide: `${CSI}?25l`,
    show: `${CSI}?25h`,
    save: `${ESC}7`,
    restore: `${ESC}8`
  };
  var scroll = {
    up: (count = 1) => `${CSI}S`.repeat(count),
    down: (count = 1) => `${CSI}T`.repeat(count)
  };
  var erase = {
    screen: `${CSI}2J`,
    up: (count = 1) => `${CSI}1J`.repeat(count),
    down: (count = 1) => `${CSI}J`.repeat(count),
    line: `${CSI}2K`,
    lineEnd: `${CSI}K`,
    lineStart: `${CSI}1K`,
    lines(count) {
      let clear = "";
      for (let i = 0;i < count; i++)
        clear += this.line + (i < count - 1 ? cursor.up() : "");
      if (count)
        clear += cursor.left;
      return clear;
    }
  };
  module.exports = { cursor, scroll, erase, beep };
});

// node_modules/prompts/dist/util/clear.js
var require_clear = __commonJS((exports, module) => {
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i = 0;
        var F = function F() {
        };
        return { s: F, n: function n() {
          if (i >= o.length)
            return { done: true };
          return { done: false, value: o[i++] };
        }, e: function e(_e) {
          throw _e;
        }, f: F };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return { s: function s() {
      it = it.call(o);
    }, n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    }, e: function e(_e2) {
      didErr = true;
      err = _e2;
    }, f: function f() {
      try {
        if (!normalCompletion && it.return != null)
          it.return();
      } finally {
        if (didErr)
          throw err;
      }
    } };
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len);i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  var strip = require_strip();
  var _require = require_src();
  var erase = _require.erase;
  var cursor = _require.cursor;
  var width = (str) => [...strip(str)].length;
  module.exports = function(prompt, perLine) {
    if (!perLine)
      return erase.line + cursor.to(0);
    let rows = 0;
    const lines = prompt.split(/\r?\n/);
    var _iterator = _createForOfIteratorHelper(lines), _step;
    try {
      for (_iterator.s();!(_step = _iterator.n()).done; ) {
        let line = _step.value;
        rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return erase.lines(rows);
  };
});

// node_modules/prompts/dist/util/figures.js
var require_figures = __commonJS((exports, module) => {
  var main = {
    arrowUp: "\u2191",
    arrowDown: "\u2193",
    arrowLeft: "\u2190",
    arrowRight: "\u2192",
    radioOn: "\u25C9",
    radioOff: "\u25EF",
    tick: "\u2714",
    cross: "\u2716",
    ellipsis: "\u2026",
    pointerSmall: "\u203A",
    line: "\u2500",
    pointer: "\u276F"
  };
  var win = {
    arrowUp: main.arrowUp,
    arrowDown: main.arrowDown,
    arrowLeft: main.arrowLeft,
    arrowRight: main.arrowRight,
    radioOn: "(*)",
    radioOff: "( )",
    tick: "\u221A",
    cross: "\xD7",
    ellipsis: "...",
    pointerSmall: "\xBB",
    line: "\u2500",
    pointer: ">"
  };
  var figures = process.platform === "win32" ? win : main;
  module.exports = figures;
});

// node_modules/prompts/dist/util/style.js
var require_style = __commonJS((exports, module) => {
  var c = require_kleur();
  var figures = require_figures();
  var styles = Object.freeze({
    password: {
      scale: 1,
      render: (input) => "*".repeat(input.length)
    },
    emoji: {
      scale: 2,
      render: (input) => "\uD83D\uDE03".repeat(input.length)
    },
    invisible: {
      scale: 0,
      render: (input) => ""
    },
    default: {
      scale: 1,
      render: (input) => `${input}`
    }
  });
  var render = (type) => styles[type] || styles.default;
  var symbols = Object.freeze({
    aborted: c.red(figures.cross),
    done: c.green(figures.tick),
    exited: c.yellow(figures.cross),
    default: c.cyan("?")
  });
  var symbol = (done, aborted, exited) => aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;
  var delimiter = (completing) => c.gray(completing ? figures.ellipsis : figures.pointerSmall);
  var item = (expandable, expanded) => c.gray(expandable ? expanded ? figures.pointerSmall : "+" : figures.line);
  module.exports = {
    styles,
    render,
    symbols,
    symbol,
    delimiter,
    item
  };
});

// node_modules/prompts/dist/util/lines.js
var require_lines = __commonJS((exports, module) => {
  var strip = require_strip();
  module.exports = function(msg, perLine) {
    let lines = String(strip(msg) || "").split(/\r?\n/);
    if (!perLine)
      return lines.length;
    return lines.map((l) => Math.ceil(l.length / perLine)).reduce((a, b) => a + b);
  };
});

// node_modules/prompts/dist/util/wrap.js
var require_wrap = __commonJS((exports, module) => {
  module.exports = (msg, opts = {}) => {
    const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
    const width = opts.width;
    return (msg || "").split(/\r?\n/g).map((line) => line.split(/\s+/g).reduce((arr, w) => {
      if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width)
        arr[arr.length - 1] += ` ${w}`;
      else
        arr.push(`${tab}${w}`);
      return arr;
    }, [tab]).join("\n")).join("\n");
  };
});

// node_modules/prompts/dist/util/entriesToDisplay.js
var require_entriesToDisplay = __commonJS((exports, module) => {
  module.exports = (cursor, total, maxVisible) => {
    maxVisible = maxVisible || total;
    let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
    if (startIndex < 0)
      startIndex = 0;
    let endIndex = Math.min(startIndex + maxVisible, total);
    return {
      startIndex,
      endIndex
    };
  };
});

// node_modules/prompts/dist/util/index.js
var require_util = __commonJS((exports, module) => {
  module.exports = {
    action: require_action(),
    clear: require_clear(),
    style: require_style(),
    strip: require_strip(),
    figures: require_figures(),
    lines: require_lines(),
    wrap: require_wrap(),
    entriesToDisplay: require_entriesToDisplay()
  };
});

// node_modules/prompts/dist/elements/prompt.js
var require_prompt = __commonJS((exports, module) => {
  var readline = __require("readline");
  var _require = require_util();
  var action = _require.action;
  var EventEmitter = __require("events");
  var _require2 = require_src();
  var beep = _require2.beep;
  var cursor = _require2.cursor;
  var color = require_kleur();

  class Prompt extends EventEmitter {
    constructor(opts = {}) {
      super();
      this.firstRender = true;
      this.in = opts.stdin || process.stdin;
      this.out = opts.stdout || process.stdout;
      this.onRender = (opts.onRender || (() => {
        return;
      })).bind(this);
      const rl = readline.createInterface({
        input: this.in,
        escapeCodeTimeout: 50
      });
      readline.emitKeypressEvents(this.in, rl);
      if (this.in.isTTY)
        this.in.setRawMode(true);
      const isSelect = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1;
      const keypress = (str, key) => {
        let a = action(key, isSelect);
        if (a === false) {
          this._ && this._(str, key);
        } else if (typeof this[a] === "function") {
          this[a](key);
        } else {
          this.bell();
        }
      };
      this.close = () => {
        this.out.write(cursor.show);
        this.in.removeListener("keypress", keypress);
        if (this.in.isTTY)
          this.in.setRawMode(false);
        rl.close();
        this.emit(this.aborted ? "abort" : this.exited ? "exit" : "submit", this.value);
        this.closed = true;
      };
      this.in.on("keypress", keypress);
    }
    fire() {
      this.emit("state", {
        value: this.value,
        aborted: !!this.aborted,
        exited: !!this.exited
      });
    }
    bell() {
      this.out.write(beep);
    }
    render() {
      this.onRender(color);
      if (this.firstRender)
        this.firstRender = false;
    }
  }
  module.exports = Prompt;
});

// node_modules/prompts/dist/elements/text.js
var require_text = __commonJS((exports, module) => {
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function() {
      var self = this, args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_src();
  var erase = _require.erase;
  var cursor = _require.cursor;
  var _require2 = require_util();
  var style = _require2.style;
  var clear = _require2.clear;
  var lines = _require2.lines;
  var figures = _require2.figures;

  class TextPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.transform = style.render(opts.style);
      this.scale = this.transform.scale;
      this.msg = opts.message;
      this.initial = opts.initial || ``;
      this.validator = opts.validate || (() => true);
      this.value = ``;
      this.errorMsg = opts.error || `Please Enter A Valid Value`;
      this.cursor = Number(!!this.initial);
      this.cursorOffset = 0;
      this.clear = clear(``, this.out.columns);
      this.render();
    }
    set value(v) {
      if (!v && this.initial) {
        this.placeholder = true;
        this.rendered = color.gray(this.transform.render(this.initial));
      } else {
        this.placeholder = false;
        this.rendered = this.transform.render(v);
      }
      this._value = v;
      this.fire();
    }
    get value() {
      return this._value;
    }
    reset() {
      this.value = ``;
      this.cursor = Number(!!this.initial);
      this.cursorOffset = 0;
      this.fire();
      this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.value = this.value || this.initial;
      this.done = this.aborted = true;
      this.error = false;
      this.red = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    validate() {
      var _this = this;
      return _asyncToGenerator(function* () {
        let valid = yield _this.validator(_this.value);
        if (typeof valid === `string`) {
          _this.errorMsg = valid;
          valid = false;
        }
        _this.error = !valid;
      })();
    }
    submit() {
      var _this2 = this;
      return _asyncToGenerator(function* () {
        _this2.value = _this2.value || _this2.initial;
        _this2.cursorOffset = 0;
        _this2.cursor = _this2.rendered.length;
        yield _this2.validate();
        if (_this2.error) {
          _this2.red = true;
          _this2.fire();
          _this2.render();
          return;
        }
        _this2.done = true;
        _this2.aborted = false;
        _this2.fire();
        _this2.render();
        _this2.out.write("\n");
        _this2.close();
      })();
    }
    next() {
      if (!this.placeholder)
        return this.bell();
      this.value = this.initial;
      this.cursor = this.rendered.length;
      this.fire();
      this.render();
    }
    moveCursor(n) {
      if (this.placeholder)
        return;
      this.cursor = this.cursor + n;
      this.cursorOffset += n;
    }
    _(c, key) {
      let s1 = this.value.slice(0, this.cursor);
      let s2 = this.value.slice(this.cursor);
      this.value = `${s1}${c}${s2}`;
      this.red = false;
      this.cursor = this.placeholder ? 0 : s1.length + 1;
      this.render();
    }
    delete() {
      if (this.isCursorAtStart())
        return this.bell();
      let s1 = this.value.slice(0, this.cursor - 1);
      let s2 = this.value.slice(this.cursor);
      this.value = `${s1}${s2}`;
      this.red = false;
      if (this.isCursorAtStart()) {
        this.cursorOffset = 0;
      } else {
        this.cursorOffset++;
        this.moveCursor(-1);
      }
      this.render();
    }
    deleteForward() {
      if (this.cursor * this.scale >= this.rendered.length || this.placeholder)
        return this.bell();
      let s1 = this.value.slice(0, this.cursor);
      let s2 = this.value.slice(this.cursor + 1);
      this.value = `${s1}${s2}`;
      this.red = false;
      if (this.isCursorAtEnd()) {
        this.cursorOffset = 0;
      } else {
        this.cursorOffset++;
      }
      this.render();
    }
    first() {
      this.cursor = 0;
      this.render();
    }
    last() {
      this.cursor = this.value.length;
      this.render();
    }
    left() {
      if (this.cursor <= 0 || this.placeholder)
        return this.bell();
      this.moveCursor(-1);
      this.render();
    }
    right() {
      if (this.cursor * this.scale >= this.rendered.length || this.placeholder)
        return this.bell();
      this.moveCursor(1);
      this.render();
    }
    isCursorAtStart() {
      return this.cursor === 0 || this.placeholder && this.cursor === 1;
    }
    isCursorAtEnd() {
      return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
    }
    render() {
      if (this.closed)
        return;
      if (!this.firstRender) {
        if (this.outputError)
          this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
        this.out.write(clear(this.outputText, this.out.columns));
      }
      super.render();
      this.outputError = "";
      this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(this.done), this.red ? color.red(this.rendered) : this.rendered].join(` `);
      if (this.error) {
        this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`, ``);
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
    }
  }
  module.exports = TextPrompt;
});

// node_modules/prompts/dist/elements/select.js
var require_select = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_util();
  var style = _require.style;
  var clear = _require.clear;
  var figures = _require.figures;
  var wrap = _require.wrap;
  var entriesToDisplay = _require.entriesToDisplay;
  var _require2 = require_src();
  var cursor = _require2.cursor;

  class SelectPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
      this.warn = opts.warn || "- This option is disabled";
      this.cursor = opts.initial || 0;
      this.choices = opts.choices.map((ch, idx) => {
        if (typeof ch === "string")
          ch = {
            title: ch,
            value: idx
          };
        return {
          title: ch && (ch.title || ch.value || ch),
          value: ch && (ch.value === undefined ? idx : ch.value),
          description: ch && ch.description,
          selected: ch && ch.selected,
          disabled: ch && ch.disabled
        };
      });
      this.optionsPerPage = opts.optionsPerPage || 10;
      this.value = (this.choices[this.cursor] || {}).value;
      this.clear = clear("", this.out.columns);
      this.render();
    }
    moveCursor(n) {
      this.cursor = n;
      this.value = this.choices[n].value;
      this.fire();
    }
    reset() {
      this.moveCursor(0);
      this.fire();
      this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    submit() {
      if (!this.selection.disabled) {
        this.done = true;
        this.aborted = false;
        this.fire();
        this.render();
        this.out.write("\n");
        this.close();
      } else
        this.bell();
    }
    first() {
      this.moveCursor(0);
      this.render();
    }
    last() {
      this.moveCursor(this.choices.length - 1);
      this.render();
    }
    up() {
      if (this.cursor === 0) {
        this.moveCursor(this.choices.length - 1);
      } else {
        this.moveCursor(this.cursor - 1);
      }
      this.render();
    }
    down() {
      if (this.cursor === this.choices.length - 1) {
        this.moveCursor(0);
      } else {
        this.moveCursor(this.cursor + 1);
      }
      this.render();
    }
    next() {
      this.moveCursor((this.cursor + 1) % this.choices.length);
      this.render();
    }
    _(c, key) {
      if (c === " ")
        return this.submit();
    }
    get selection() {
      return this.choices[this.cursor];
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText, this.out.columns));
      super.render();
      let _entriesToDisplay = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
      this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(false), this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)].join(" ");
      if (!this.done) {
        this.outputText += "\n";
        for (let i = startIndex;i < endIndex; i++) {
          let title, prefix, desc = "", v = this.choices[i];
          if (i === startIndex && startIndex > 0) {
            prefix = figures.arrowUp;
          } else if (i === endIndex - 1 && endIndex < this.choices.length) {
            prefix = figures.arrowDown;
          } else {
            prefix = " ";
          }
          if (v.disabled) {
            title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
            prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + " " : "  ") + prefix;
          } else {
            title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
            prefix = (this.cursor === i ? color.cyan(figures.pointer) + " " : "  ") + prefix;
            if (v.description && this.cursor === i) {
              desc = ` - ${v.description}`;
              if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
                desc = "\n" + wrap(v.description, {
                  margin: 3,
                  width: this.out.columns
                });
              }
            }
          }
          this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
        }
      }
      this.out.write(this.outputText);
    }
  }
  module.exports = SelectPrompt;
});

// node_modules/prompts/dist/elements/toggle.js
var require_toggle = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_util();
  var style = _require.style;
  var clear = _require.clear;
  var _require2 = require_src();
  var cursor = _require2.cursor;
  var erase = _require2.erase;

  class TogglePrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.value = !!opts.initial;
      this.active = opts.active || "on";
      this.inactive = opts.inactive || "off";
      this.initialValue = this.value;
      this.render();
    }
    reset() {
      this.value = this.initialValue;
      this.fire();
      this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    submit() {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    deactivate() {
      if (this.value === false)
        return this.bell();
      this.value = false;
      this.render();
    }
    activate() {
      if (this.value === true)
        return this.bell();
      this.value = true;
      this.render();
    }
    delete() {
      this.deactivate();
    }
    left() {
      this.deactivate();
    }
    right() {
      this.activate();
    }
    down() {
      this.deactivate();
    }
    up() {
      this.activate();
    }
    next() {
      this.value = !this.value;
      this.fire();
      this.render();
    }
    _(c, key) {
      if (c === " ") {
        this.value = !this.value;
      } else if (c === "1") {
        this.value = true;
      } else if (c === "0") {
        this.value = false;
      } else
        return this.bell();
      this.render();
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText, this.out.columns));
      super.render();
      this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(this.done), this.value ? this.inactive : color.cyan().underline(this.inactive), color.gray("/"), this.value ? color.cyan().underline(this.active) : this.active].join(" ");
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = TogglePrompt;
});

// node_modules/prompts/dist/dateparts/datepart.js
var require_datepart = __commonJS((exports, module) => {
  class DatePart {
    constructor({
      token,
      date,
      parts,
      locales
    }) {
      this.token = token;
      this.date = date || new Date;
      this.parts = parts || [this];
      this.locales = locales || {};
    }
    up() {
    }
    down() {
    }
    next() {
      const currentIdx = this.parts.indexOf(this);
      return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
    }
    setTo(val) {
    }
    prev() {
      let parts = [].concat(this.parts).reverse();
      const currentIdx = parts.indexOf(this);
      return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
    }
    toString() {
      return String(this.date);
    }
  }
  module.exports = DatePart;
});

// node_modules/prompts/dist/dateparts/meridiem.js
var require_meridiem = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Meridiem extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setHours((this.date.getHours() + 12) % 24);
    }
    down() {
      this.up();
    }
    toString() {
      let meridiem = this.date.getHours() > 12 ? "pm" : "am";
      return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
    }
  }
  module.exports = Meridiem;
});

// node_modules/prompts/dist/dateparts/day.js
var require_day = __commonJS((exports, module) => {
  var DatePart = require_datepart();
  var pos = (n) => {
    n = n % 10;
    return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  };

  class Day extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setDate(this.date.getDate() + 1);
    }
    down() {
      this.date.setDate(this.date.getDate() - 1);
    }
    setTo(val) {
      this.date.setDate(parseInt(val.substr(-2)));
    }
    toString() {
      let date = this.date.getDate();
      let day = this.date.getDay();
      return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
    }
  }
  module.exports = Day;
});

// node_modules/prompts/dist/dateparts/hours.js
var require_hours = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Hours extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setHours(this.date.getHours() + 1);
    }
    down() {
      this.date.setHours(this.date.getHours() - 1);
    }
    setTo(val) {
      this.date.setHours(parseInt(val.substr(-2)));
    }
    toString() {
      let hours = this.date.getHours();
      if (/h/.test(this.token))
        hours = hours % 12 || 12;
      return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
    }
  }
  module.exports = Hours;
});

// node_modules/prompts/dist/dateparts/milliseconds.js
var require_milliseconds = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Milliseconds extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setMilliseconds(this.date.getMilliseconds() + 1);
    }
    down() {
      this.date.setMilliseconds(this.date.getMilliseconds() - 1);
    }
    setTo(val) {
      this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
    }
    toString() {
      return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
    }
  }
  module.exports = Milliseconds;
});

// node_modules/prompts/dist/dateparts/minutes.js
var require_minutes = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Minutes extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setMinutes(this.date.getMinutes() + 1);
    }
    down() {
      this.date.setMinutes(this.date.getMinutes() - 1);
    }
    setTo(val) {
      this.date.setMinutes(parseInt(val.substr(-2)));
    }
    toString() {
      let m = this.date.getMinutes();
      return this.token.length > 1 ? String(m).padStart(2, "0") : m;
    }
  }
  module.exports = Minutes;
});

// node_modules/prompts/dist/dateparts/month.js
var require_month = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Month extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setMonth(this.date.getMonth() + 1);
    }
    down() {
      this.date.setMonth(this.date.getMonth() - 1);
    }
    setTo(val) {
      val = parseInt(val.substr(-2)) - 1;
      this.date.setMonth(val < 0 ? 0 : val);
    }
    toString() {
      let month = this.date.getMonth();
      let tl = this.token.length;
      return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
    }
  }
  module.exports = Month;
});

// node_modules/prompts/dist/dateparts/seconds.js
var require_seconds = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Seconds extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setSeconds(this.date.getSeconds() + 1);
    }
    down() {
      this.date.setSeconds(this.date.getSeconds() - 1);
    }
    setTo(val) {
      this.date.setSeconds(parseInt(val.substr(-2)));
    }
    toString() {
      let s = this.date.getSeconds();
      return this.token.length > 1 ? String(s).padStart(2, "0") : s;
    }
  }
  module.exports = Seconds;
});

// node_modules/prompts/dist/dateparts/year.js
var require_year = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Year extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setFullYear(this.date.getFullYear() + 1);
    }
    down() {
      this.date.setFullYear(this.date.getFullYear() - 1);
    }
    setTo(val) {
      this.date.setFullYear(val.substr(-4));
    }
    toString() {
      let year = String(this.date.getFullYear()).padStart(4, "0");
      return this.token.length === 2 ? year.substr(-2) : year;
    }
  }
  module.exports = Year;
});

// node_modules/prompts/dist/dateparts/index.js
var require_dateparts = __commonJS((exports, module) => {
  module.exports = {
    DatePart: require_datepart(),
    Meridiem: require_meridiem(),
    Day: require_day(),
    Hours: require_hours(),
    Milliseconds: require_milliseconds(),
    Minutes: require_minutes(),
    Month: require_month(),
    Seconds: require_seconds(),
    Year: require_year()
  };
});

// node_modules/prompts/dist/elements/date.js
var require_date = __commonJS((exports, module) => {
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function() {
      var self = this, args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_util();
  var style = _require.style;
  var clear = _require.clear;
  var figures = _require.figures;
  var _require2 = require_src();
  var erase = _require2.erase;
  var cursor = _require2.cursor;
  var _require3 = require_dateparts();
  var DatePart = _require3.DatePart;
  var Meridiem = _require3.Meridiem;
  var Day = _require3.Day;
  var Hours = _require3.Hours;
  var Milliseconds = _require3.Milliseconds;
  var Minutes = _require3.Minutes;
  var Month = _require3.Month;
  var Seconds = _require3.Seconds;
  var Year = _require3.Year;
  var regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
  var regexGroups = {
    1: ({
      token
    }) => token.replace(/\\(.)/g, "$1"),
    2: (opts) => new Day(opts),
    3: (opts) => new Month(opts),
    4: (opts) => new Year(opts),
    5: (opts) => new Meridiem(opts),
    6: (opts) => new Hours(opts),
    7: (opts) => new Minutes(opts),
    8: (opts) => new Seconds(opts),
    9: (opts) => new Milliseconds(opts)
  };
  var dfltLocales = {
    months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
    monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
    weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
    weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
  };

  class DatePrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.cursor = 0;
      this.typed = "";
      this.locales = Object.assign(dfltLocales, opts.locales);
      this._date = opts.initial || new Date;
      this.errorMsg = opts.error || "Please Enter A Valid Value";
      this.validator = opts.validate || (() => true);
      this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
      this.clear = clear("", this.out.columns);
      this.render();
    }
    get value() {
      return this.date;
    }
    get date() {
      return this._date;
    }
    set date(date) {
      if (date)
        this._date.setTime(date.getTime());
    }
    set mask(mask) {
      let result;
      this.parts = [];
      while (result = regex.exec(mask)) {
        let match = result.shift();
        let idx = result.findIndex((gr) => gr != null);
        this.parts.push(idx in regexGroups ? regexGroups[idx]({
          token: result[idx] || match,
          date: this.date,
          parts: this.parts,
          locales: this.locales
        }) : result[idx] || match);
      }
      let parts = this.parts.reduce((arr, i) => {
        if (typeof i === "string" && typeof arr[arr.length - 1] === "string")
          arr[arr.length - 1] += i;
        else
          arr.push(i);
        return arr;
      }, []);
      this.parts.splice(0);
      this.parts.push(...parts);
      this.reset();
    }
    moveCursor(n) {
      this.typed = "";
      this.cursor = n;
      this.fire();
    }
    reset() {
      this.moveCursor(this.parts.findIndex((p) => p instanceof DatePart));
      this.fire();
      this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = true;
      this.error = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    validate() {
      var _this = this;
      return _asyncToGenerator(function* () {
        let valid = yield _this.validator(_this.value);
        if (typeof valid === "string") {
          _this.errorMsg = valid;
          valid = false;
        }
        _this.error = !valid;
      })();
    }
    submit() {
      var _this2 = this;
      return _asyncToGenerator(function* () {
        yield _this2.validate();
        if (_this2.error) {
          _this2.color = "red";
          _this2.fire();
          _this2.render();
          return;
        }
        _this2.done = true;
        _this2.aborted = false;
        _this2.fire();
        _this2.render();
        _this2.out.write("\n");
        _this2.close();
      })();
    }
    up() {
      this.typed = "";
      this.parts[this.cursor].up();
      this.render();
    }
    down() {
      this.typed = "";
      this.parts[this.cursor].down();
      this.render();
    }
    left() {
      let prev = this.parts[this.cursor].prev();
      if (prev == null)
        return this.bell();
      this.moveCursor(this.parts.indexOf(prev));
      this.render();
    }
    right() {
      let next = this.parts[this.cursor].next();
      if (next == null)
        return this.bell();
      this.moveCursor(this.parts.indexOf(next));
      this.render();
    }
    next() {
      let next = this.parts[this.cursor].next();
      this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part) => part instanceof DatePart));
      this.render();
    }
    _(c) {
      if (/\d/.test(c)) {
        this.typed += c;
        this.parts[this.cursor].setTo(this.typed);
        this.render();
      }
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText, this.out.columns));
      super.render();
      this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(false), this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join("")].join(" ");
      if (this.error) {
        this.outputText += this.errorMsg.split("\n").reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = DatePrompt;
});

// node_modules/prompts/dist/elements/number.js
var require_number = __commonJS((exports, module) => {
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function() {
      var self = this, args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_src();
  var cursor = _require.cursor;
  var erase = _require.erase;
  var _require2 = require_util();
  var style = _require2.style;
  var figures = _require2.figures;
  var clear = _require2.clear;
  var lines = _require2.lines;
  var isNumber = /[0-9]/;
  var isDef = (any) => any !== undefined;
  var round = (number, precision) => {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  };

  class NumberPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.transform = style.render(opts.style);
      this.msg = opts.message;
      this.initial = isDef(opts.initial) ? opts.initial : "";
      this.float = !!opts.float;
      this.round = opts.round || 2;
      this.inc = opts.increment || 1;
      this.min = isDef(opts.min) ? opts.min : -Infinity;
      this.max = isDef(opts.max) ? opts.max : Infinity;
      this.errorMsg = opts.error || `Please Enter A Valid Value`;
      this.validator = opts.validate || (() => true);
      this.color = `cyan`;
      this.value = ``;
      this.typed = ``;
      this.lastHit = 0;
      this.render();
    }
    set value(v) {
      if (!v && v !== 0) {
        this.placeholder = true;
        this.rendered = color.gray(this.transform.render(`${this.initial}`));
        this._value = ``;
      } else {
        this.placeholder = false;
        this.rendered = this.transform.render(`${round(v, this.round)}`);
        this._value = round(v, this.round);
      }
      this.fire();
    }
    get value() {
      return this._value;
    }
    parse(x) {
      return this.float ? parseFloat(x) : parseInt(x);
    }
    valid(c) {
      return c === `-` || c === `.` && this.float || isNumber.test(c);
    }
    reset() {
      this.typed = ``;
      this.value = ``;
      this.fire();
      this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      let x = this.value;
      this.value = x !== `` ? x : this.initial;
      this.done = this.aborted = true;
      this.error = false;
      this.fire();
      this.render();
      this.out.write(`\n`);
      this.close();
    }
    validate() {
      var _this = this;
      return _asyncToGenerator(function* () {
        let valid = yield _this.validator(_this.value);
        if (typeof valid === `string`) {
          _this.errorMsg = valid;
          valid = false;
        }
        _this.error = !valid;
      })();
    }
    submit() {
      var _this2 = this;
      return _asyncToGenerator(function* () {
        yield _this2.validate();
        if (_this2.error) {
          _this2.color = `red`;
          _this2.fire();
          _this2.render();
          return;
        }
        let x = _this2.value;
        _this2.value = x !== `` ? x : _this2.initial;
        _this2.done = true;
        _this2.aborted = false;
        _this2.error = false;
        _this2.fire();
        _this2.render();
        _this2.out.write(`\n`);
        _this2.close();
      })();
    }
    up() {
      this.typed = ``;
      if (this.value === "") {
        this.value = this.min - this.inc;
      }
      if (this.value >= this.max)
        return this.bell();
      this.value += this.inc;
      this.color = `cyan`;
      this.fire();
      this.render();
    }
    down() {
      this.typed = ``;
      if (this.value === "") {
        this.value = this.min + this.inc;
      }
      if (this.value <= this.min)
        return this.bell();
      this.value -= this.inc;
      this.color = `cyan`;
      this.fire();
      this.render();
    }
    delete() {
      let val = this.value.toString();
      if (val.length === 0)
        return this.bell();
      this.value = this.parse(val = val.slice(0, -1)) || ``;
      if (this.value !== "" && this.value < this.min) {
        this.value = this.min;
      }
      this.color = `cyan`;
      this.fire();
      this.render();
    }
    next() {
      this.value = this.initial;
      this.fire();
      this.render();
    }
    _(c, key) {
      if (!this.valid(c))
        return this.bell();
      const now = Date.now();
      if (now - this.lastHit > 1000)
        this.typed = ``;
      this.typed += c;
      this.lastHit = now;
      this.color = `cyan`;
      if (c === `.`)
        return this.fire();
      this.value = Math.min(this.parse(this.typed), this.max);
      if (this.value > this.max)
        this.value = this.max;
      if (this.value < this.min)
        this.value = this.min;
      this.fire();
      this.render();
    }
    render() {
      if (this.closed)
        return;
      if (!this.firstRender) {
        if (this.outputError)
          this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
        this.out.write(clear(this.outputText, this.out.columns));
      }
      super.render();
      this.outputError = "";
      this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(this.done), !this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered].join(` `);
      if (this.error) {
        this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
    }
  }
  module.exports = NumberPrompt;
});

// node_modules/prompts/dist/elements/multiselect.js
var require_multiselect = __commonJS((exports, module) => {
  var color = require_kleur();
  var _require = require_src();
  var cursor = _require.cursor;
  var Prompt = require_prompt();
  var _require2 = require_util();
  var clear = _require2.clear;
  var figures = _require2.figures;
  var style = _require2.style;
  var wrap = _require2.wrap;
  var entriesToDisplay = _require2.entriesToDisplay;

  class MultiselectPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.cursor = opts.cursor || 0;
      this.scrollIndex = opts.cursor || 0;
      this.hint = opts.hint || "";
      this.warn = opts.warn || "- This option is disabled -";
      this.minSelected = opts.min;
      this.showMinError = false;
      this.maxChoices = opts.max;
      this.instructions = opts.instructions;
      this.optionsPerPage = opts.optionsPerPage || 10;
      this.value = opts.choices.map((ch, idx) => {
        if (typeof ch === "string")
          ch = {
            title: ch,
            value: idx
          };
        return {
          title: ch && (ch.title || ch.value || ch),
          description: ch && ch.description,
          value: ch && (ch.value === undefined ? idx : ch.value),
          selected: ch && ch.selected,
          disabled: ch && ch.disabled
        };
      });
      this.clear = clear("", this.out.columns);
      if (!opts.overrideRender) {
        this.render();
      }
    }
    reset() {
      this.value.map((v) => !v.selected);
      this.cursor = 0;
      this.fire();
      this.render();
    }
    selected() {
      return this.value.filter((v) => v.selected);
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    submit() {
      const selected = this.value.filter((e) => e.selected);
      if (this.minSelected && selected.length < this.minSelected) {
        this.showMinError = true;
        this.render();
      } else {
        this.done = true;
        this.aborted = false;
        this.fire();
        this.render();
        this.out.write("\n");
        this.close();
      }
    }
    first() {
      this.cursor = 0;
      this.render();
    }
    last() {
      this.cursor = this.value.length - 1;
      this.render();
    }
    next() {
      this.cursor = (this.cursor + 1) % this.value.length;
      this.render();
    }
    up() {
      if (this.cursor === 0) {
        this.cursor = this.value.length - 1;
      } else {
        this.cursor--;
      }
      this.render();
    }
    down() {
      if (this.cursor === this.value.length - 1) {
        this.cursor = 0;
      } else {
        this.cursor++;
      }
      this.render();
    }
    left() {
      this.value[this.cursor].selected = false;
      this.render();
    }
    right() {
      if (this.value.filter((e) => e.selected).length >= this.maxChoices)
        return this.bell();
      this.value[this.cursor].selected = true;
      this.render();
    }
    handleSpaceToggle() {
      const v = this.value[this.cursor];
      if (v.selected) {
        v.selected = false;
        this.render();
      } else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) {
        return this.bell();
      } else {
        v.selected = true;
        this.render();
      }
    }
    toggleAll() {
      if (this.maxChoices !== undefined || this.value[this.cursor].disabled) {
        return this.bell();
      }
      const newSelected = !this.value[this.cursor].selected;
      this.value.filter((v) => !v.disabled).forEach((v) => v.selected = newSelected);
      this.render();
    }
    _(c, key) {
      if (c === " ") {
        this.handleSpaceToggle();
      } else if (c === "a") {
        this.toggleAll();
      } else {
        return this.bell();
      }
    }
    renderInstructions() {
      if (this.instructions === undefined || this.instructions) {
        if (typeof this.instructions === "string") {
          return this.instructions;
        }
        return "\nInstructions:\n" + `    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n` + `    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === undefined ? `    a: Toggle all\n` : "") + `    enter/return: Complete answer`;
      }
      return "";
    }
    renderOption(cursor2, v, i, arrowIndicator) {
      const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + " " + arrowIndicator + " ";
      let title, desc;
      if (v.disabled) {
        title = cursor2 === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
      } else {
        title = cursor2 === i ? color.cyan().underline(v.title) : v.title;
        if (cursor2 === i && v.description) {
          desc = ` - ${v.description}`;
          if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
            desc = "\n" + wrap(v.description, {
              margin: prefix.length,
              width: this.out.columns
            });
          }
        }
      }
      return prefix + title + color.gray(desc || "");
    }
    paginateOptions(options) {
      if (options.length === 0) {
        return color.red("No matches for this query.");
      }
      let _entriesToDisplay = entriesToDisplay(this.cursor, options.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
      let prefix, styledOptions = [];
      for (let i = startIndex;i < endIndex; i++) {
        if (i === startIndex && startIndex > 0) {
          prefix = figures.arrowUp;
        } else if (i === endIndex - 1 && endIndex < options.length) {
          prefix = figures.arrowDown;
        } else {
          prefix = " ";
        }
        styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
      }
      return "\n" + styledOptions.join("\n");
    }
    renderOptions(options) {
      if (!this.done) {
        return this.paginateOptions(options);
      }
      return "";
    }
    renderDoneOrInstructions() {
      if (this.done) {
        return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
      }
      const output = [color.gray(this.hint), this.renderInstructions()];
      if (this.value[this.cursor].disabled) {
        output.push(color.yellow(this.warn));
      }
      return output.join(" ");
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      super.render();
      let prompt = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(false), this.renderDoneOrInstructions()].join(" ");
      if (this.showMinError) {
        prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
        this.showMinError = false;
      }
      prompt += this.renderOptions(this.value);
      this.out.write(this.clear + prompt);
      this.clear = clear(prompt, this.out.columns);
    }
  }
  module.exports = MultiselectPrompt;
});

// node_modules/prompts/dist/elements/autocomplete.js
var require_autocomplete = __commonJS((exports, module) => {
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function() {
      var self = this, args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_src();
  var erase = _require.erase;
  var cursor = _require.cursor;
  var _require2 = require_util();
  var style = _require2.style;
  var clear = _require2.clear;
  var figures = _require2.figures;
  var wrap = _require2.wrap;
  var entriesToDisplay = _require2.entriesToDisplay;
  var getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
  var getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
  var getIndex = (arr, valOrTitle) => {
    const index = arr.findIndex((el) => el.value === valOrTitle || el.title === valOrTitle);
    return index > -1 ? index : undefined;
  };

  class AutocompletePrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.suggest = opts.suggest;
      this.choices = opts.choices;
      this.initial = typeof opts.initial === "number" ? opts.initial : getIndex(opts.choices, opts.initial);
      this.select = this.initial || opts.cursor || 0;
      this.i18n = {
        noMatches: opts.noMatches || "no matches found"
      };
      this.fallback = opts.fallback || this.initial;
      this.clearFirst = opts.clearFirst || false;
      this.suggestions = [];
      this.input = "";
      this.limit = opts.limit || 10;
      this.cursor = 0;
      this.transform = style.render(opts.style);
      this.scale = this.transform.scale;
      this.render = this.render.bind(this);
      this.complete = this.complete.bind(this);
      this.clear = clear("", this.out.columns);
      this.complete(this.render);
      this.render();
    }
    set fallback(fb) {
      this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
    }
    get fallback() {
      let choice;
      if (typeof this._fb === "number")
        choice = this.choices[this._fb];
      else if (typeof this._fb === "string")
        choice = {
          title: this._fb
        };
      return choice || this._fb || {
        title: this.i18n.noMatches
      };
    }
    moveSelect(i) {
      this.select = i;
      if (this.suggestions.length > 0)
        this.value = getVal(this.suggestions, i);
      else
        this.value = this.fallback.value;
      this.fire();
    }
    complete(cb) {
      var _this = this;
      return _asyncToGenerator(function* () {
        const p = _this.completing = _this.suggest(_this.input, _this.choices);
        const suggestions = yield p;
        if (_this.completing !== p)
          return;
        _this.suggestions = suggestions.map((s, i, arr) => ({
          title: getTitle(arr, i),
          value: getVal(arr, i),
          description: s.description
        }));
        _this.completing = false;
        const l = Math.max(suggestions.length - 1, 0);
        _this.moveSelect(Math.min(l, _this.select));
        cb && cb();
      })();
    }
    reset() {
      this.input = "";
      this.complete(() => {
        this.moveSelect(this.initial !== undefined ? this.initial : 0);
        this.render();
      });
      this.render();
    }
    exit() {
      if (this.clearFirst && this.input.length > 0) {
        this.reset();
      } else {
        this.done = this.exited = true;
        this.aborted = false;
        this.fire();
        this.render();
        this.out.write("\n");
        this.close();
      }
    }
    abort() {
      this.done = this.aborted = true;
      this.exited = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    submit() {
      this.done = true;
      this.aborted = this.exited = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    _(c, key) {
      let s1 = this.input.slice(0, this.cursor);
      let s2 = this.input.slice(this.cursor);
      this.input = `${s1}${c}${s2}`;
      this.cursor = s1.length + 1;
      this.complete(this.render);
      this.render();
    }
    delete() {
      if (this.cursor === 0)
        return this.bell();
      let s1 = this.input.slice(0, this.cursor - 1);
      let s2 = this.input.slice(this.cursor);
      this.input = `${s1}${s2}`;
      this.complete(this.render);
      this.cursor = this.cursor - 1;
      this.render();
    }
    deleteForward() {
      if (this.cursor * this.scale >= this.rendered.length)
        return this.bell();
      let s1 = this.input.slice(0, this.cursor);
      let s2 = this.input.slice(this.cursor + 1);
      this.input = `${s1}${s2}`;
      this.complete(this.render);
      this.render();
    }
    first() {
      this.moveSelect(0);
      this.render();
    }
    last() {
      this.moveSelect(this.suggestions.length - 1);
      this.render();
    }
    up() {
      if (this.select === 0) {
        this.moveSelect(this.suggestions.length - 1);
      } else {
        this.moveSelect(this.select - 1);
      }
      this.render();
    }
    down() {
      if (this.select === this.suggestions.length - 1) {
        this.moveSelect(0);
      } else {
        this.moveSelect(this.select + 1);
      }
      this.render();
    }
    next() {
      if (this.select === this.suggestions.length - 1) {
        this.moveSelect(0);
      } else
        this.moveSelect(this.select + 1);
      this.render();
    }
    nextPage() {
      this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
      this.render();
    }
    prevPage() {
      this.moveSelect(Math.max(this.select - this.limit, 0));
      this.render();
    }
    left() {
      if (this.cursor <= 0)
        return this.bell();
      this.cursor = this.cursor - 1;
      this.render();
    }
    right() {
      if (this.cursor * this.scale >= this.rendered.length)
        return this.bell();
      this.cursor = this.cursor + 1;
      this.render();
    }
    renderOption(v, hovered, isStart, isEnd) {
      let desc;
      let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : " ";
      let title = hovered ? color.cyan().underline(v.title) : v.title;
      prefix = (hovered ? color.cyan(figures.pointer) + " " : "  ") + prefix;
      if (v.description) {
        desc = ` - ${v.description}`;
        if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
          desc = "\n" + wrap(v.description, {
            margin: 3,
            width: this.out.columns
          });
        }
      }
      return prefix + " " + title + color.gray(desc || "");
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText, this.out.columns));
      super.render();
      let _entriesToDisplay = entriesToDisplay(this.select, this.choices.length, this.limit), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
      this.outputText = [style.symbol(this.done, this.aborted, this.exited), color.bold(this.msg), style.delimiter(this.completing), this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)].join(" ");
      if (!this.done) {
        const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i) => this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join("\n");
        this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = AutocompletePrompt;
});

// node_modules/prompts/dist/elements/autocompleteMultiselect.js
var require_autocompleteMultiselect = __commonJS((exports, module) => {
  var color = require_kleur();
  var _require = require_src();
  var cursor = _require.cursor;
  var MultiselectPrompt = require_multiselect();
  var _require2 = require_util();
  var clear = _require2.clear;
  var style = _require2.style;
  var figures = _require2.figures;

  class AutocompleteMultiselectPrompt extends MultiselectPrompt {
    constructor(opts = {}) {
      opts.overrideRender = true;
      super(opts);
      this.inputValue = "";
      this.clear = clear("", this.out.columns);
      this.filteredOptions = this.value;
      this.render();
    }
    last() {
      this.cursor = this.filteredOptions.length - 1;
      this.render();
    }
    next() {
      this.cursor = (this.cursor + 1) % this.filteredOptions.length;
      this.render();
    }
    up() {
      if (this.cursor === 0) {
        this.cursor = this.filteredOptions.length - 1;
      } else {
        this.cursor--;
      }
      this.render();
    }
    down() {
      if (this.cursor === this.filteredOptions.length - 1) {
        this.cursor = 0;
      } else {
        this.cursor++;
      }
      this.render();
    }
    left() {
      this.filteredOptions[this.cursor].selected = false;
      this.render();
    }
    right() {
      if (this.value.filter((e) => e.selected).length >= this.maxChoices)
        return this.bell();
      this.filteredOptions[this.cursor].selected = true;
      this.render();
    }
    delete() {
      if (this.inputValue.length) {
        this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
        this.updateFilteredOptions();
      }
    }
    updateFilteredOptions() {
      const currentHighlight = this.filteredOptions[this.cursor];
      this.filteredOptions = this.value.filter((v) => {
        if (this.inputValue) {
          if (typeof v.title === "string") {
            if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
              return true;
            }
          }
          if (typeof v.value === "string") {
            if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) {
              return true;
            }
          }
          return false;
        }
        return true;
      });
      const newHighlightIndex = this.filteredOptions.findIndex((v) => v === currentHighlight);
      this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
      this.render();
    }
    handleSpaceToggle() {
      const v = this.filteredOptions[this.cursor];
      if (v.selected) {
        v.selected = false;
        this.render();
      } else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) {
        return this.bell();
      } else {
        v.selected = true;
        this.render();
      }
    }
    handleInputChange(c) {
      this.inputValue = this.inputValue + c;
      this.updateFilteredOptions();
    }
    _(c, key) {
      if (c === " ") {
        this.handleSpaceToggle();
      } else {
        this.handleInputChange(c);
      }
    }
    renderInstructions() {
      if (this.instructions === undefined || this.instructions) {
        if (typeof this.instructions === "string") {
          return this.instructions;
        }
        return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
      }
      return "";
    }
    renderCurrentInput() {
      return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray("Enter something to filter")}\n`;
    }
    renderOption(cursor2, v, i) {
      let title;
      if (v.disabled)
        title = cursor2 === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
      else
        title = cursor2 === i ? color.cyan().underline(v.title) : v.title;
      return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + "  " + title;
    }
    renderDoneOrInstructions() {
      if (this.done) {
        return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
      }
      const output = [color.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];
      if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) {
        output.push(color.yellow(this.warn));
      }
      return output.join(" ");
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      super.render();
      let prompt = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(false), this.renderDoneOrInstructions()].join(" ");
      if (this.showMinError) {
        prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
        this.showMinError = false;
      }
      prompt += this.renderOptions(this.filteredOptions);
      this.out.write(this.clear + prompt);
      this.clear = clear(prompt, this.out.columns);
    }
  }
  module.exports = AutocompleteMultiselectPrompt;
});

// node_modules/prompts/dist/elements/confirm.js
var require_confirm = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_util();
  var style = _require.style;
  var clear = _require.clear;
  var _require2 = require_src();
  var erase = _require2.erase;
  var cursor = _require2.cursor;

  class ConfirmPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.value = opts.initial;
      this.initialValue = !!opts.initial;
      this.yesMsg = opts.yes || "yes";
      this.yesOption = opts.yesOption || "(Y/n)";
      this.noMsg = opts.no || "no";
      this.noOption = opts.noOption || "(y/N)";
      this.render();
    }
    reset() {
      this.value = this.initialValue;
      this.fire();
      this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    submit() {
      this.value = this.value || false;
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    _(c, key) {
      if (c.toLowerCase() === "y") {
        this.value = true;
        return this.submit();
      }
      if (c.toLowerCase() === "n") {
        this.value = false;
        return this.submit();
      }
      return this.bell();
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText, this.out.columns));
      super.render();
      this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(this.done), this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)].join(" ");
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = ConfirmPrompt;
});

// node_modules/prompts/dist/elements/index.js
var require_elements = __commonJS((exports, module) => {
  module.exports = {
    TextPrompt: require_text(),
    SelectPrompt: require_select(),
    TogglePrompt: require_toggle(),
    DatePrompt: require_date(),
    NumberPrompt: require_number(),
    MultiselectPrompt: require_multiselect(),
    AutocompletePrompt: require_autocomplete(),
    AutocompleteMultiselectPrompt: require_autocompleteMultiselect(),
    ConfirmPrompt: require_confirm()
  };
});

// node_modules/prompts/dist/prompts.js
var require_prompts = __commonJS((exports) => {
  function toPrompt(type, args, opts = {}) {
    return new Promise((res, rej) => {
      const p = new el[type](args);
      const onAbort = opts.onAbort || noop;
      const onSubmit = opts.onSubmit || noop;
      const onExit = opts.onExit || noop;
      p.on("state", args.onState || noop);
      p.on("submit", (x) => res(onSubmit(x)));
      p.on("exit", (x) => res(onExit(x)));
      p.on("abort", (x) => rej(onAbort(x)));
    });
  }
  var $ = exports;
  var el = require_elements();
  var noop = (v) => v;
  $.text = (args) => toPrompt("TextPrompt", args);
  $.password = (args) => {
    args.style = "password";
    return $.text(args);
  };
  $.invisible = (args) => {
    args.style = "invisible";
    return $.text(args);
  };
  $.number = (args) => toPrompt("NumberPrompt", args);
  $.date = (args) => toPrompt("DatePrompt", args);
  $.confirm = (args) => toPrompt("ConfirmPrompt", args);
  $.list = (args) => {
    const sep = args.separator || ",";
    return toPrompt("TextPrompt", args, {
      onSubmit: (str) => str.split(sep).map((s) => s.trim())
    });
  };
  $.toggle = (args) => toPrompt("TogglePrompt", args);
  $.select = (args) => toPrompt("SelectPrompt", args);
  $.multiselect = (args) => {
    args.choices = [].concat(args.choices || []);
    const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
    return toPrompt("MultiselectPrompt", args, {
      onAbort: toSelected,
      onSubmit: toSelected
    });
  };
  $.autocompleteMultiselect = (args) => {
    args.choices = [].concat(args.choices || []);
    const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
    return toPrompt("AutocompleteMultiselectPrompt", args, {
      onAbort: toSelected,
      onSubmit: toSelected
    });
  };
  var byTitle = (input, choices) => Promise.resolve(choices.filter((item) => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
  $.autocomplete = (args) => {
    args.suggest = args.suggest || byTitle;
    args.choices = [].concat(args.choices || []);
    return toPrompt("AutocompletePrompt", args);
  };
});

// node_modules/prompts/dist/index.js
var require_dist = __commonJS((exports, module) => {
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread(target) {
    for (var i = 1;i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i = 0;
        var F = function F() {
        };
        return { s: F, n: function n() {
          if (i >= o.length)
            return { done: true };
          return { done: false, value: o[i++] };
        }, e: function e(_e) {
          throw _e;
        }, f: F };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return { s: function s() {
      it = it.call(o);
    }, n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    }, e: function e(_e2) {
      didErr = true;
      err = _e2;
    }, f: function f() {
      try {
        if (!normalCompletion && it.return != null)
          it.return();
      } finally {
        if (didErr)
          throw err;
      }
    } };
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len);i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function() {
      var self = this, args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  function prompt() {
    return _prompt.apply(this, arguments);
  }
  function _prompt() {
    _prompt = _asyncToGenerator(function* (questions = [], {
      onSubmit = noop,
      onCancel = noop
    } = {}) {
      const answers = {};
      const override2 = prompt._override || {};
      questions = [].concat(questions);
      let answer, question, quit, name, type, lastPrompt;
      const getFormattedAnswer = /* @__PURE__ */ function() {
        var _ref = _asyncToGenerator(function* (question2, answer2, skipValidation = false) {
          if (!skipValidation && question2.validate && question2.validate(answer2) !== true) {
            return;
          }
          return question2.format ? yield question2.format(answer2, answers) : answer2;
        });
        return function getFormattedAnswer(_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }();
      var _iterator = _createForOfIteratorHelper(questions), _step;
      try {
        for (_iterator.s();!(_step = _iterator.n()).done; ) {
          question = _step.value;
          var _question = question;
          name = _question.name;
          type = _question.type;
          if (typeof type === "function") {
            type = yield type(answer, _objectSpread({}, answers), question);
            question["type"] = type;
          }
          if (!type)
            continue;
          for (let key in question) {
            if (passOn.includes(key))
              continue;
            let value = question[key];
            question[key] = typeof value === "function" ? yield value(answer, _objectSpread({}, answers), lastPrompt) : value;
          }
          lastPrompt = question;
          if (typeof question.message !== "string") {
            throw new Error("prompt message is required");
          }
          var _question2 = question;
          name = _question2.name;
          type = _question2.type;
          if (prompts[type] === undefined) {
            throw new Error(`prompt type (${type}) is not defined`);
          }
          if (override2[question.name] !== undefined) {
            answer = yield getFormattedAnswer(question, override2[question.name]);
            if (answer !== undefined) {
              answers[name] = answer;
              continue;
            }
          }
          try {
            answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : yield prompts[type](question);
            answers[name] = answer = yield getFormattedAnswer(question, answer, true);
            quit = yield onSubmit(question, answer, answers);
          } catch (err) {
            quit = !(yield onCancel(question, answers));
          }
          if (quit)
            return answers;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return answers;
    });
    return _prompt.apply(this, arguments);
  }
  function getInjectedAnswer(injected, deafultValue) {
    const answer = injected.shift();
    if (answer instanceof Error) {
      throw answer;
    }
    return answer === undefined ? deafultValue : answer;
  }
  function inject(answers) {
    prompt._injected = (prompt._injected || []).concat(answers);
  }
  function override(answers) {
    prompt._override = Object.assign({}, answers);
  }
  var prompts = require_prompts();
  var passOn = ["suggest", "format", "onState", "validate", "onRender", "type"];
  var noop = () => {
  };
  module.exports = Object.assign(prompt, {
    prompt,
    prompts,
    inject,
    override
  });
});

// node_modules/prompts/lib/util/action.js
var require_action2 = __commonJS((exports, module) => {
  module.exports = (key, isSelect) => {
    if (key.meta && key.name !== "escape")
      return;
    if (key.ctrl) {
      if (key.name === "a")
        return "first";
      if (key.name === "c")
        return "abort";
      if (key.name === "d")
        return "abort";
      if (key.name === "e")
        return "last";
      if (key.name === "g")
        return "reset";
    }
    if (isSelect) {
      if (key.name === "j")
        return "down";
      if (key.name === "k")
        return "up";
    }
    if (key.name === "return")
      return "submit";
    if (key.name === "enter")
      return "submit";
    if (key.name === "backspace")
      return "delete";
    if (key.name === "delete")
      return "deleteForward";
    if (key.name === "abort")
      return "abort";
    if (key.name === "escape")
      return "exit";
    if (key.name === "tab")
      return "next";
    if (key.name === "pagedown")
      return "nextPage";
    if (key.name === "pageup")
      return "prevPage";
    if (key.name === "home")
      return "home";
    if (key.name === "end")
      return "end";
    if (key.name === "up")
      return "up";
    if (key.name === "down")
      return "down";
    if (key.name === "right")
      return "right";
    if (key.name === "left")
      return "left";
    return false;
  };
});

// node_modules/prompts/lib/util/strip.js
var require_strip2 = __commonJS((exports, module) => {
  module.exports = (str) => {
    const pattern = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"
    ].join("|");
    const RGX = new RegExp(pattern, "g");
    return typeof str === "string" ? str.replace(RGX, "") : str;
  };
});

// node_modules/prompts/lib/util/clear.js
var require_clear2 = __commonJS((exports, module) => {
  var strip = require_strip2();
  var { erase, cursor } = require_src();
  var width = (str) => [...strip(str)].length;
  module.exports = function(prompt, perLine) {
    if (!perLine)
      return erase.line + cursor.to(0);
    let rows = 0;
    const lines = prompt.split(/\r?\n/);
    for (let line of lines) {
      rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
    }
    return erase.lines(rows);
  };
});

// node_modules/prompts/lib/util/figures.js
var require_figures2 = __commonJS((exports, module) => {
  var main = {
    arrowUp: "\u2191",
    arrowDown: "\u2193",
    arrowLeft: "\u2190",
    arrowRight: "\u2192",
    radioOn: "\u25C9",
    radioOff: "\u25EF",
    tick: "\u2714",
    cross: "\u2716",
    ellipsis: "\u2026",
    pointerSmall: "\u203A",
    line: "\u2500",
    pointer: "\u276F"
  };
  var win = {
    arrowUp: main.arrowUp,
    arrowDown: main.arrowDown,
    arrowLeft: main.arrowLeft,
    arrowRight: main.arrowRight,
    radioOn: "(*)",
    radioOff: "( )",
    tick: "\u221A",
    cross: "\xD7",
    ellipsis: "...",
    pointerSmall: "\xBB",
    line: "\u2500",
    pointer: ">"
  };
  var figures = process.platform === "win32" ? win : main;
  module.exports = figures;
});

// node_modules/prompts/lib/util/style.js
var require_style2 = __commonJS((exports, module) => {
  var c = require_kleur();
  var figures = require_figures2();
  var styles = Object.freeze({
    password: { scale: 1, render: (input) => "*".repeat(input.length) },
    emoji: { scale: 2, render: (input) => "\uD83D\uDE03".repeat(input.length) },
    invisible: { scale: 0, render: (input) => "" },
    default: { scale: 1, render: (input) => `${input}` }
  });
  var render = (type) => styles[type] || styles.default;
  var symbols = Object.freeze({
    aborted: c.red(figures.cross),
    done: c.green(figures.tick),
    exited: c.yellow(figures.cross),
    default: c.cyan("?")
  });
  var symbol = (done, aborted, exited) => aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;
  var delimiter = (completing) => c.gray(completing ? figures.ellipsis : figures.pointerSmall);
  var item = (expandable, expanded) => c.gray(expandable ? expanded ? figures.pointerSmall : "+" : figures.line);
  module.exports = {
    styles,
    render,
    symbols,
    symbol,
    delimiter,
    item
  };
});

// node_modules/prompts/lib/util/lines.js
var require_lines2 = __commonJS((exports, module) => {
  var strip = require_strip2();
  module.exports = function(msg, perLine) {
    let lines = String(strip(msg) || "").split(/\r?\n/);
    if (!perLine)
      return lines.length;
    return lines.map((l) => Math.ceil(l.length / perLine)).reduce((a, b) => a + b);
  };
});

// node_modules/prompts/lib/util/wrap.js
var require_wrap2 = __commonJS((exports, module) => {
  module.exports = (msg, opts = {}) => {
    const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
    const width = opts.width;
    return (msg || "").split(/\r?\n/g).map((line) => line.split(/\s+/g).reduce((arr, w) => {
      if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width)
        arr[arr.length - 1] += ` ${w}`;
      else
        arr.push(`${tab}${w}`);
      return arr;
    }, [tab]).join("\n")).join("\n");
  };
});

// node_modules/prompts/lib/util/entriesToDisplay.js
var require_entriesToDisplay2 = __commonJS((exports, module) => {
  module.exports = (cursor, total, maxVisible) => {
    maxVisible = maxVisible || total;
    let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
    if (startIndex < 0)
      startIndex = 0;
    let endIndex = Math.min(startIndex + maxVisible, total);
    return { startIndex, endIndex };
  };
});

// node_modules/prompts/lib/util/index.js
var require_util2 = __commonJS((exports, module) => {
  module.exports = {
    action: require_action2(),
    clear: require_clear2(),
    style: require_style2(),
    strip: require_strip2(),
    figures: require_figures2(),
    lines: require_lines2(),
    wrap: require_wrap2(),
    entriesToDisplay: require_entriesToDisplay2()
  };
});

// node_modules/prompts/lib/elements/prompt.js
var require_prompt2 = __commonJS((exports, module) => {
  var readline = __require("readline");
  var { action } = require_util2();
  var EventEmitter = __require("events");
  var { beep, cursor } = require_src();
  var color = require_kleur();

  class Prompt extends EventEmitter {
    constructor(opts = {}) {
      super();
      this.firstRender = true;
      this.in = opts.stdin || process.stdin;
      this.out = opts.stdout || process.stdout;
      this.onRender = (opts.onRender || (() => {
        return;
      })).bind(this);
      const rl = readline.createInterface({ input: this.in, escapeCodeTimeout: 50 });
      readline.emitKeypressEvents(this.in, rl);
      if (this.in.isTTY)
        this.in.setRawMode(true);
      const isSelect = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1;
      const keypress = (str, key) => {
        let a = action(key, isSelect);
        if (a === false) {
          this._ && this._(str, key);
        } else if (typeof this[a] === "function") {
          this[a](key);
        } else {
          this.bell();
        }
      };
      this.close = () => {
        this.out.write(cursor.show);
        this.in.removeListener("keypress", keypress);
        if (this.in.isTTY)
          this.in.setRawMode(false);
        rl.close();
        this.emit(this.aborted ? "abort" : this.exited ? "exit" : "submit", this.value);
        this.closed = true;
      };
      this.in.on("keypress", keypress);
    }
    fire() {
      this.emit("state", {
        value: this.value,
        aborted: !!this.aborted,
        exited: !!this.exited
      });
    }
    bell() {
      this.out.write(beep);
    }
    render() {
      this.onRender(color);
      if (this.firstRender)
        this.firstRender = false;
    }
  }
  module.exports = Prompt;
});

// node_modules/prompts/lib/elements/text.js
var require_text2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { erase, cursor } = require_src();
  var { style, clear, lines, figures } = require_util2();

  class TextPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.transform = style.render(opts.style);
      this.scale = this.transform.scale;
      this.msg = opts.message;
      this.initial = opts.initial || ``;
      this.validator = opts.validate || (() => true);
      this.value = ``;
      this.errorMsg = opts.error || `Please Enter A Valid Value`;
      this.cursor = Number(!!this.initial);
      this.cursorOffset = 0;
      this.clear = clear(``, this.out.columns);
      this.render();
    }
    set value(v) {
      if (!v && this.initial) {
        this.placeholder = true;
        this.rendered = color.gray(this.transform.render(this.initial));
      } else {
        this.placeholder = false;
        this.rendered = this.transform.render(v);
      }
      this._value = v;
      this.fire();
    }
    get value() {
      return this._value;
    }
    reset() {
      this.value = ``;
      this.cursor = Number(!!this.initial);
      this.cursorOffset = 0;
      this.fire();
      this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.value = this.value || this.initial;
      this.done = this.aborted = true;
      this.error = false;
      this.red = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    async validate() {
      let valid = await this.validator(this.value);
      if (typeof valid === `string`) {
        this.errorMsg = valid;
        valid = false;
      }
      this.error = !valid;
    }
    async submit() {
      this.value = this.value || this.initial;
      this.cursorOffset = 0;
      this.cursor = this.rendered.length;
      await this.validate();
      if (this.error) {
        this.red = true;
        this.fire();
        this.render();
        return;
      }
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    next() {
      if (!this.placeholder)
        return this.bell();
      this.value = this.initial;
      this.cursor = this.rendered.length;
      this.fire();
      this.render();
    }
    moveCursor(n) {
      if (this.placeholder)
        return;
      this.cursor = this.cursor + n;
      this.cursorOffset += n;
    }
    _(c, key) {
      let s1 = this.value.slice(0, this.cursor);
      let s2 = this.value.slice(this.cursor);
      this.value = `${s1}${c}${s2}`;
      this.red = false;
      this.cursor = this.placeholder ? 0 : s1.length + 1;
      this.render();
    }
    delete() {
      if (this.isCursorAtStart())
        return this.bell();
      let s1 = this.value.slice(0, this.cursor - 1);
      let s2 = this.value.slice(this.cursor);
      this.value = `${s1}${s2}`;
      this.red = false;
      if (this.isCursorAtStart()) {
        this.cursorOffset = 0;
      } else {
        this.cursorOffset++;
        this.moveCursor(-1);
      }
      this.render();
    }
    deleteForward() {
      if (this.cursor * this.scale >= this.rendered.length || this.placeholder)
        return this.bell();
      let s1 = this.value.slice(0, this.cursor);
      let s2 = this.value.slice(this.cursor + 1);
      this.value = `${s1}${s2}`;
      this.red = false;
      if (this.isCursorAtEnd()) {
        this.cursorOffset = 0;
      } else {
        this.cursorOffset++;
      }
      this.render();
    }
    first() {
      this.cursor = 0;
      this.render();
    }
    last() {
      this.cursor = this.value.length;
      this.render();
    }
    left() {
      if (this.cursor <= 0 || this.placeholder)
        return this.bell();
      this.moveCursor(-1);
      this.render();
    }
    right() {
      if (this.cursor * this.scale >= this.rendered.length || this.placeholder)
        return this.bell();
      this.moveCursor(1);
      this.render();
    }
    isCursorAtStart() {
      return this.cursor === 0 || this.placeholder && this.cursor === 1;
    }
    isCursorAtEnd() {
      return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
    }
    render() {
      if (this.closed)
        return;
      if (!this.firstRender) {
        if (this.outputError)
          this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
        this.out.write(clear(this.outputText, this.out.columns));
      }
      super.render();
      this.outputError = "";
      this.outputText = [
        style.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style.delimiter(this.done),
        this.red ? color.red(this.rendered) : this.rendered
      ].join(` `);
      if (this.error) {
        this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`, ``);
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
    }
  }
  module.exports = TextPrompt;
});

// node_modules/prompts/lib/elements/select.js
var require_select2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { style, clear, figures, wrap, entriesToDisplay } = require_util2();
  var { cursor } = require_src();

  class SelectPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
      this.warn = opts.warn || "- This option is disabled";
      this.cursor = opts.initial || 0;
      this.choices = opts.choices.map((ch, idx) => {
        if (typeof ch === "string")
          ch = { title: ch, value: idx };
        return {
          title: ch && (ch.title || ch.value || ch),
          value: ch && (ch.value === undefined ? idx : ch.value),
          description: ch && ch.description,
          selected: ch && ch.selected,
          disabled: ch && ch.disabled
        };
      });
      this.optionsPerPage = opts.optionsPerPage || 10;
      this.value = (this.choices[this.cursor] || {}).value;
      this.clear = clear("", this.out.columns);
      this.render();
    }
    moveCursor(n) {
      this.cursor = n;
      this.value = this.choices[n].value;
      this.fire();
    }
    reset() {
      this.moveCursor(0);
      this.fire();
      this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    submit() {
      if (!this.selection.disabled) {
        this.done = true;
        this.aborted = false;
        this.fire();
        this.render();
        this.out.write("\n");
        this.close();
      } else
        this.bell();
    }
    first() {
      this.moveCursor(0);
      this.render();
    }
    last() {
      this.moveCursor(this.choices.length - 1);
      this.render();
    }
    up() {
      if (this.cursor === 0) {
        this.moveCursor(this.choices.length - 1);
      } else {
        this.moveCursor(this.cursor - 1);
      }
      this.render();
    }
    down() {
      if (this.cursor === this.choices.length - 1) {
        this.moveCursor(0);
      } else {
        this.moveCursor(this.cursor + 1);
      }
      this.render();
    }
    next() {
      this.moveCursor((this.cursor + 1) % this.choices.length);
      this.render();
    }
    _(c, key) {
      if (c === " ")
        return this.submit();
    }
    get selection() {
      return this.choices[this.cursor];
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText, this.out.columns));
      super.render();
      let { startIndex, endIndex } = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage);
      this.outputText = [
        style.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style.delimiter(false),
        this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)
      ].join(" ");
      if (!this.done) {
        this.outputText += "\n";
        for (let i = startIndex;i < endIndex; i++) {
          let title, prefix, desc = "", v = this.choices[i];
          if (i === startIndex && startIndex > 0) {
            prefix = figures.arrowUp;
          } else if (i === endIndex - 1 && endIndex < this.choices.length) {
            prefix = figures.arrowDown;
          } else {
            prefix = " ";
          }
          if (v.disabled) {
            title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
            prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + " " : "  ") + prefix;
          } else {
            title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
            prefix = (this.cursor === i ? color.cyan(figures.pointer) + " " : "  ") + prefix;
            if (v.description && this.cursor === i) {
              desc = ` - ${v.description}`;
              if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
                desc = "\n" + wrap(v.description, { margin: 3, width: this.out.columns });
              }
            }
          }
          this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
        }
      }
      this.out.write(this.outputText);
    }
  }
  module.exports = SelectPrompt;
});

// node_modules/prompts/lib/elements/toggle.js
var require_toggle2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { style, clear } = require_util2();
  var { cursor, erase } = require_src();

  class TogglePrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.value = !!opts.initial;
      this.active = opts.active || "on";
      this.inactive = opts.inactive || "off";
      this.initialValue = this.value;
      this.render();
    }
    reset() {
      this.value = this.initialValue;
      this.fire();
      this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    submit() {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    deactivate() {
      if (this.value === false)
        return this.bell();
      this.value = false;
      this.render();
    }
    activate() {
      if (this.value === true)
        return this.bell();
      this.value = true;
      this.render();
    }
    delete() {
      this.deactivate();
    }
    left() {
      this.deactivate();
    }
    right() {
      this.activate();
    }
    down() {
      this.deactivate();
    }
    up() {
      this.activate();
    }
    next() {
      this.value = !this.value;
      this.fire();
      this.render();
    }
    _(c, key) {
      if (c === " ") {
        this.value = !this.value;
      } else if (c === "1") {
        this.value = true;
      } else if (c === "0") {
        this.value = false;
      } else
        return this.bell();
      this.render();
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText, this.out.columns));
      super.render();
      this.outputText = [
        style.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style.delimiter(this.done),
        this.value ? this.inactive : color.cyan().underline(this.inactive),
        color.gray("/"),
        this.value ? color.cyan().underline(this.active) : this.active
      ].join(" ");
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = TogglePrompt;
});

// node_modules/prompts/lib/dateparts/datepart.js
var require_datepart2 = __commonJS((exports, module) => {
  class DatePart {
    constructor({ token, date, parts, locales }) {
      this.token = token;
      this.date = date || new Date;
      this.parts = parts || [this];
      this.locales = locales || {};
    }
    up() {
    }
    down() {
    }
    next() {
      const currentIdx = this.parts.indexOf(this);
      return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
    }
    setTo(val) {
    }
    prev() {
      let parts = [].concat(this.parts).reverse();
      const currentIdx = parts.indexOf(this);
      return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
    }
    toString() {
      return String(this.date);
    }
  }
  module.exports = DatePart;
});

// node_modules/prompts/lib/dateparts/meridiem.js
var require_meridiem2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Meridiem extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setHours((this.date.getHours() + 12) % 24);
    }
    down() {
      this.up();
    }
    toString() {
      let meridiem = this.date.getHours() > 12 ? "pm" : "am";
      return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
    }
  }
  module.exports = Meridiem;
});

// node_modules/prompts/lib/dateparts/day.js
var require_day2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();
  var pos = (n) => {
    n = n % 10;
    return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  };

  class Day extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setDate(this.date.getDate() + 1);
    }
    down() {
      this.date.setDate(this.date.getDate() - 1);
    }
    setTo(val) {
      this.date.setDate(parseInt(val.substr(-2)));
    }
    toString() {
      let date = this.date.getDate();
      let day = this.date.getDay();
      return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
    }
  }
  module.exports = Day;
});

// node_modules/prompts/lib/dateparts/hours.js
var require_hours2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Hours extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setHours(this.date.getHours() + 1);
    }
    down() {
      this.date.setHours(this.date.getHours() - 1);
    }
    setTo(val) {
      this.date.setHours(parseInt(val.substr(-2)));
    }
    toString() {
      let hours = this.date.getHours();
      if (/h/.test(this.token))
        hours = hours % 12 || 12;
      return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
    }
  }
  module.exports = Hours;
});

// node_modules/prompts/lib/dateparts/milliseconds.js
var require_milliseconds2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Milliseconds extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setMilliseconds(this.date.getMilliseconds() + 1);
    }
    down() {
      this.date.setMilliseconds(this.date.getMilliseconds() - 1);
    }
    setTo(val) {
      this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
    }
    toString() {
      return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
    }
  }
  module.exports = Milliseconds;
});

// node_modules/prompts/lib/dateparts/minutes.js
var require_minutes2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Minutes extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setMinutes(this.date.getMinutes() + 1);
    }
    down() {
      this.date.setMinutes(this.date.getMinutes() - 1);
    }
    setTo(val) {
      this.date.setMinutes(parseInt(val.substr(-2)));
    }
    toString() {
      let m = this.date.getMinutes();
      return this.token.length > 1 ? String(m).padStart(2, "0") : m;
    }
  }
  module.exports = Minutes;
});

// node_modules/prompts/lib/dateparts/month.js
var require_month2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Month extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setMonth(this.date.getMonth() + 1);
    }
    down() {
      this.date.setMonth(this.date.getMonth() - 1);
    }
    setTo(val) {
      val = parseInt(val.substr(-2)) - 1;
      this.date.setMonth(val < 0 ? 0 : val);
    }
    toString() {
      let month = this.date.getMonth();
      let tl = this.token.length;
      return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
    }
  }
  module.exports = Month;
});

// node_modules/prompts/lib/dateparts/seconds.js
var require_seconds2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Seconds extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setSeconds(this.date.getSeconds() + 1);
    }
    down() {
      this.date.setSeconds(this.date.getSeconds() - 1);
    }
    setTo(val) {
      this.date.setSeconds(parseInt(val.substr(-2)));
    }
    toString() {
      let s = this.date.getSeconds();
      return this.token.length > 1 ? String(s).padStart(2, "0") : s;
    }
  }
  module.exports = Seconds;
});

// node_modules/prompts/lib/dateparts/year.js
var require_year2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Year extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setFullYear(this.date.getFullYear() + 1);
    }
    down() {
      this.date.setFullYear(this.date.getFullYear() - 1);
    }
    setTo(val) {
      this.date.setFullYear(val.substr(-4));
    }
    toString() {
      let year = String(this.date.getFullYear()).padStart(4, "0");
      return this.token.length === 2 ? year.substr(-2) : year;
    }
  }
  module.exports = Year;
});

// node_modules/prompts/lib/dateparts/index.js
var require_dateparts2 = __commonJS((exports, module) => {
  module.exports = {
    DatePart: require_datepart2(),
    Meridiem: require_meridiem2(),
    Day: require_day2(),
    Hours: require_hours2(),
    Milliseconds: require_milliseconds2(),
    Minutes: require_minutes2(),
    Month: require_month2(),
    Seconds: require_seconds2(),
    Year: require_year2()
  };
});

// node_modules/prompts/lib/elements/date.js
var require_date2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { style, clear, figures } = require_util2();
  var { erase, cursor } = require_src();
  var { DatePart, Meridiem, Day, Hours, Milliseconds, Minutes, Month, Seconds, Year } = require_dateparts2();
  var regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
  var regexGroups = {
    1: ({ token }) => token.replace(/\\(.)/g, "$1"),
    2: (opts) => new Day(opts),
    3: (opts) => new Month(opts),
    4: (opts) => new Year(opts),
    5: (opts) => new Meridiem(opts),
    6: (opts) => new Hours(opts),
    7: (opts) => new Minutes(opts),
    8: (opts) => new Seconds(opts),
    9: (opts) => new Milliseconds(opts)
  };
  var dfltLocales = {
    months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
    monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
    weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
    weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
  };

  class DatePrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.cursor = 0;
      this.typed = "";
      this.locales = Object.assign(dfltLocales, opts.locales);
      this._date = opts.initial || new Date;
      this.errorMsg = opts.error || "Please Enter A Valid Value";
      this.validator = opts.validate || (() => true);
      this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
      this.clear = clear("", this.out.columns);
      this.render();
    }
    get value() {
      return this.date;
    }
    get date() {
      return this._date;
    }
    set date(date) {
      if (date)
        this._date.setTime(date.getTime());
    }
    set mask(mask) {
      let result;
      this.parts = [];
      while (result = regex.exec(mask)) {
        let match = result.shift();
        let idx = result.findIndex((gr) => gr != null);
        this.parts.push(idx in regexGroups ? regexGroups[idx]({ token: result[idx] || match, date: this.date, parts: this.parts, locales: this.locales }) : result[idx] || match);
      }
      let parts = this.parts.reduce((arr, i) => {
        if (typeof i === "string" && typeof arr[arr.length - 1] === "string")
          arr[arr.length - 1] += i;
        else
          arr.push(i);
        return arr;
      }, []);
      this.parts.splice(0);
      this.parts.push(...parts);
      this.reset();
    }
    moveCursor(n) {
      this.typed = "";
      this.cursor = n;
      this.fire();
    }
    reset() {
      this.moveCursor(this.parts.findIndex((p) => p instanceof DatePart));
      this.fire();
      this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = true;
      this.error = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    async validate() {
      let valid = await this.validator(this.value);
      if (typeof valid === "string") {
        this.errorMsg = valid;
        valid = false;
      }
      this.error = !valid;
    }
    async submit() {
      await this.validate();
      if (this.error) {
        this.color = "red";
        this.fire();
        this.render();
        return;
      }
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    up() {
      this.typed = "";
      this.parts[this.cursor].up();
      this.render();
    }
    down() {
      this.typed = "";
      this.parts[this.cursor].down();
      this.render();
    }
    left() {
      let prev = this.parts[this.cursor].prev();
      if (prev == null)
        return this.bell();
      this.moveCursor(this.parts.indexOf(prev));
      this.render();
    }
    right() {
      let next = this.parts[this.cursor].next();
      if (next == null)
        return this.bell();
      this.moveCursor(this.parts.indexOf(next));
      this.render();
    }
    next() {
      let next = this.parts[this.cursor].next();
      this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part) => part instanceof DatePart));
      this.render();
    }
    _(c) {
      if (/\d/.test(c)) {
        this.typed += c;
        this.parts[this.cursor].setTo(this.typed);
        this.render();
      }
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText, this.out.columns));
      super.render();
      this.outputText = [
        style.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style.delimiter(false),
        this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join("")
      ].join(" ");
      if (this.error) {
        this.outputText += this.errorMsg.split("\n").reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = DatePrompt;
});

// node_modules/prompts/lib/elements/number.js
var require_number2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { cursor, erase } = require_src();
  var { style, figures, clear, lines } = require_util2();
  var isNumber = /[0-9]/;
  var isDef = (any) => any !== undefined;
  var round = (number, precision) => {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  };

  class NumberPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.transform = style.render(opts.style);
      this.msg = opts.message;
      this.initial = isDef(opts.initial) ? opts.initial : "";
      this.float = !!opts.float;
      this.round = opts.round || 2;
      this.inc = opts.increment || 1;
      this.min = isDef(opts.min) ? opts.min : -Infinity;
      this.max = isDef(opts.max) ? opts.max : Infinity;
      this.errorMsg = opts.error || `Please Enter A Valid Value`;
      this.validator = opts.validate || (() => true);
      this.color = `cyan`;
      this.value = ``;
      this.typed = ``;
      this.lastHit = 0;
      this.render();
    }
    set value(v) {
      if (!v && v !== 0) {
        this.placeholder = true;
        this.rendered = color.gray(this.transform.render(`${this.initial}`));
        this._value = ``;
      } else {
        this.placeholder = false;
        this.rendered = this.transform.render(`${round(v, this.round)}`);
        this._value = round(v, this.round);
      }
      this.fire();
    }
    get value() {
      return this._value;
    }
    parse(x) {
      return this.float ? parseFloat(x) : parseInt(x);
    }
    valid(c) {
      return c === `-` || c === `.` && this.float || isNumber.test(c);
    }
    reset() {
      this.typed = ``;
      this.value = ``;
      this.fire();
      this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      let x = this.value;
      this.value = x !== `` ? x : this.initial;
      this.done = this.aborted = true;
      this.error = false;
      this.fire();
      this.render();
      this.out.write(`\n`);
      this.close();
    }
    async validate() {
      let valid = await this.validator(this.value);
      if (typeof valid === `string`) {
        this.errorMsg = valid;
        valid = false;
      }
      this.error = !valid;
    }
    async submit() {
      await this.validate();
      if (this.error) {
        this.color = `red`;
        this.fire();
        this.render();
        return;
      }
      let x = this.value;
      this.value = x !== `` ? x : this.initial;
      this.done = true;
      this.aborted = false;
      this.error = false;
      this.fire();
      this.render();
      this.out.write(`\n`);
      this.close();
    }
    up() {
      this.typed = ``;
      if (this.value === "") {
        this.value = this.min - this.inc;
      }
      if (this.value >= this.max)
        return this.bell();
      this.value += this.inc;
      this.color = `cyan`;
      this.fire();
      this.render();
    }
    down() {
      this.typed = ``;
      if (this.value === "") {
        this.value = this.min + this.inc;
      }
      if (this.value <= this.min)
        return this.bell();
      this.value -= this.inc;
      this.color = `cyan`;
      this.fire();
      this.render();
    }
    delete() {
      let val = this.value.toString();
      if (val.length === 0)
        return this.bell();
      this.value = this.parse(val = val.slice(0, -1)) || ``;
      if (this.value !== "" && this.value < this.min) {
        this.value = this.min;
      }
      this.color = `cyan`;
      this.fire();
      this.render();
    }
    next() {
      this.value = this.initial;
      this.fire();
      this.render();
    }
    _(c, key) {
      if (!this.valid(c))
        return this.bell();
      const now = Date.now();
      if (now - this.lastHit > 1000)
        this.typed = ``;
      this.typed += c;
      this.lastHit = now;
      this.color = `cyan`;
      if (c === `.`)
        return this.fire();
      this.value = Math.min(this.parse(this.typed), this.max);
      if (this.value > this.max)
        this.value = this.max;
      if (this.value < this.min)
        this.value = this.min;
      this.fire();
      this.render();
    }
    render() {
      if (this.closed)
        return;
      if (!this.firstRender) {
        if (this.outputError)
          this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
        this.out.write(clear(this.outputText, this.out.columns));
      }
      super.render();
      this.outputError = "";
      this.outputText = [
        style.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style.delimiter(this.done),
        !this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered
      ].join(` `);
      if (this.error) {
        this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
    }
  }
  module.exports = NumberPrompt;
});

// node_modules/prompts/lib/elements/multiselect.js
var require_multiselect2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var { cursor } = require_src();
  var Prompt = require_prompt2();
  var { clear, figures, style, wrap, entriesToDisplay } = require_util2();

  class MultiselectPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.cursor = opts.cursor || 0;
      this.scrollIndex = opts.cursor || 0;
      this.hint = opts.hint || "";
      this.warn = opts.warn || "- This option is disabled -";
      this.minSelected = opts.min;
      this.showMinError = false;
      this.maxChoices = opts.max;
      this.instructions = opts.instructions;
      this.optionsPerPage = opts.optionsPerPage || 10;
      this.value = opts.choices.map((ch, idx) => {
        if (typeof ch === "string")
          ch = { title: ch, value: idx };
        return {
          title: ch && (ch.title || ch.value || ch),
          description: ch && ch.description,
          value: ch && (ch.value === undefined ? idx : ch.value),
          selected: ch && ch.selected,
          disabled: ch && ch.disabled
        };
      });
      this.clear = clear("", this.out.columns);
      if (!opts.overrideRender) {
        this.render();
      }
    }
    reset() {
      this.value.map((v) => !v.selected);
      this.cursor = 0;
      this.fire();
      this.render();
    }
    selected() {
      return this.value.filter((v) => v.selected);
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    submit() {
      const selected = this.value.filter((e) => e.selected);
      if (this.minSelected && selected.length < this.minSelected) {
        this.showMinError = true;
        this.render();
      } else {
        this.done = true;
        this.aborted = false;
        this.fire();
        this.render();
        this.out.write("\n");
        this.close();
      }
    }
    first() {
      this.cursor = 0;
      this.render();
    }
    last() {
      this.cursor = this.value.length - 1;
      this.render();
    }
    next() {
      this.cursor = (this.cursor + 1) % this.value.length;
      this.render();
    }
    up() {
      if (this.cursor === 0) {
        this.cursor = this.value.length - 1;
      } else {
        this.cursor--;
      }
      this.render();
    }
    down() {
      if (this.cursor === this.value.length - 1) {
        this.cursor = 0;
      } else {
        this.cursor++;
      }
      this.render();
    }
    left() {
      this.value[this.cursor].selected = false;
      this.render();
    }
    right() {
      if (this.value.filter((e) => e.selected).length >= this.maxChoices)
        return this.bell();
      this.value[this.cursor].selected = true;
      this.render();
    }
    handleSpaceToggle() {
      const v = this.value[this.cursor];
      if (v.selected) {
        v.selected = false;
        this.render();
      } else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) {
        return this.bell();
      } else {
        v.selected = true;
        this.render();
      }
    }
    toggleAll() {
      if (this.maxChoices !== undefined || this.value[this.cursor].disabled) {
        return this.bell();
      }
      const newSelected = !this.value[this.cursor].selected;
      this.value.filter((v) => !v.disabled).forEach((v) => v.selected = newSelected);
      this.render();
    }
    _(c, key) {
      if (c === " ") {
        this.handleSpaceToggle();
      } else if (c === "a") {
        this.toggleAll();
      } else {
        return this.bell();
      }
    }
    renderInstructions() {
      if (this.instructions === undefined || this.instructions) {
        if (typeof this.instructions === "string") {
          return this.instructions;
        }
        return "\nInstructions:\n" + `    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n` + `    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === undefined ? `    a: Toggle all\n` : "") + `    enter/return: Complete answer`;
      }
      return "";
    }
    renderOption(cursor2, v, i, arrowIndicator) {
      const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + " " + arrowIndicator + " ";
      let title, desc;
      if (v.disabled) {
        title = cursor2 === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
      } else {
        title = cursor2 === i ? color.cyan().underline(v.title) : v.title;
        if (cursor2 === i && v.description) {
          desc = ` - ${v.description}`;
          if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
            desc = "\n" + wrap(v.description, { margin: prefix.length, width: this.out.columns });
          }
        }
      }
      return prefix + title + color.gray(desc || "");
    }
    paginateOptions(options) {
      if (options.length === 0) {
        return color.red("No matches for this query.");
      }
      let { startIndex, endIndex } = entriesToDisplay(this.cursor, options.length, this.optionsPerPage);
      let prefix, styledOptions = [];
      for (let i = startIndex;i < endIndex; i++) {
        if (i === startIndex && startIndex > 0) {
          prefix = figures.arrowUp;
        } else if (i === endIndex - 1 && endIndex < options.length) {
          prefix = figures.arrowDown;
        } else {
          prefix = " ";
        }
        styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
      }
      return "\n" + styledOptions.join("\n");
    }
    renderOptions(options) {
      if (!this.done) {
        return this.paginateOptions(options);
      }
      return "";
    }
    renderDoneOrInstructions() {
      if (this.done) {
        return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
      }
      const output = [color.gray(this.hint), this.renderInstructions()];
      if (this.value[this.cursor].disabled) {
        output.push(color.yellow(this.warn));
      }
      return output.join(" ");
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      super.render();
      let prompt = [
        style.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style.delimiter(false),
        this.renderDoneOrInstructions()
      ].join(" ");
      if (this.showMinError) {
        prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
        this.showMinError = false;
      }
      prompt += this.renderOptions(this.value);
      this.out.write(this.clear + prompt);
      this.clear = clear(prompt, this.out.columns);
    }
  }
  module.exports = MultiselectPrompt;
});

// node_modules/prompts/lib/elements/autocomplete.js
var require_autocomplete2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { erase, cursor } = require_src();
  var { style, clear, figures, wrap, entriesToDisplay } = require_util2();
  var getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
  var getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
  var getIndex = (arr, valOrTitle) => {
    const index = arr.findIndex((el) => el.value === valOrTitle || el.title === valOrTitle);
    return index > -1 ? index : undefined;
  };

  class AutocompletePrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.suggest = opts.suggest;
      this.choices = opts.choices;
      this.initial = typeof opts.initial === "number" ? opts.initial : getIndex(opts.choices, opts.initial);
      this.select = this.initial || opts.cursor || 0;
      this.i18n = { noMatches: opts.noMatches || "no matches found" };
      this.fallback = opts.fallback || this.initial;
      this.clearFirst = opts.clearFirst || false;
      this.suggestions = [];
      this.input = "";
      this.limit = opts.limit || 10;
      this.cursor = 0;
      this.transform = style.render(opts.style);
      this.scale = this.transform.scale;
      this.render = this.render.bind(this);
      this.complete = this.complete.bind(this);
      this.clear = clear("", this.out.columns);
      this.complete(this.render);
      this.render();
    }
    set fallback(fb) {
      this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
    }
    get fallback() {
      let choice;
      if (typeof this._fb === "number")
        choice = this.choices[this._fb];
      else if (typeof this._fb === "string")
        choice = { title: this._fb };
      return choice || this._fb || { title: this.i18n.noMatches };
    }
    moveSelect(i) {
      this.select = i;
      if (this.suggestions.length > 0)
        this.value = getVal(this.suggestions, i);
      else
        this.value = this.fallback.value;
      this.fire();
    }
    async complete(cb) {
      const p = this.completing = this.suggest(this.input, this.choices);
      const suggestions = await p;
      if (this.completing !== p)
        return;
      this.suggestions = suggestions.map((s, i, arr) => ({ title: getTitle(arr, i), value: getVal(arr, i), description: s.description }));
      this.completing = false;
      const l = Math.max(suggestions.length - 1, 0);
      this.moveSelect(Math.min(l, this.select));
      cb && cb();
    }
    reset() {
      this.input = "";
      this.complete(() => {
        this.moveSelect(this.initial !== undefined ? this.initial : 0);
        this.render();
      });
      this.render();
    }
    exit() {
      if (this.clearFirst && this.input.length > 0) {
        this.reset();
      } else {
        this.done = this.exited = true;
        this.aborted = false;
        this.fire();
        this.render();
        this.out.write("\n");
        this.close();
      }
    }
    abort() {
      this.done = this.aborted = true;
      this.exited = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    submit() {
      this.done = true;
      this.aborted = this.exited = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    _(c, key) {
      let s1 = this.input.slice(0, this.cursor);
      let s2 = this.input.slice(this.cursor);
      this.input = `${s1}${c}${s2}`;
      this.cursor = s1.length + 1;
      this.complete(this.render);
      this.render();
    }
    delete() {
      if (this.cursor === 0)
        return this.bell();
      let s1 = this.input.slice(0, this.cursor - 1);
      let s2 = this.input.slice(this.cursor);
      this.input = `${s1}${s2}`;
      this.complete(this.render);
      this.cursor = this.cursor - 1;
      this.render();
    }
    deleteForward() {
      if (this.cursor * this.scale >= this.rendered.length)
        return this.bell();
      let s1 = this.input.slice(0, this.cursor);
      let s2 = this.input.slice(this.cursor + 1);
      this.input = `${s1}${s2}`;
      this.complete(this.render);
      this.render();
    }
    first() {
      this.moveSelect(0);
      this.render();
    }
    last() {
      this.moveSelect(this.suggestions.length - 1);
      this.render();
    }
    up() {
      if (this.select === 0) {
        this.moveSelect(this.suggestions.length - 1);
      } else {
        this.moveSelect(this.select - 1);
      }
      this.render();
    }
    down() {
      if (this.select === this.suggestions.length - 1) {
        this.moveSelect(0);
      } else {
        this.moveSelect(this.select + 1);
      }
      this.render();
    }
    next() {
      if (this.select === this.suggestions.length - 1) {
        this.moveSelect(0);
      } else
        this.moveSelect(this.select + 1);
      this.render();
    }
    nextPage() {
      this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
      this.render();
    }
    prevPage() {
      this.moveSelect(Math.max(this.select - this.limit, 0));
      this.render();
    }
    left() {
      if (this.cursor <= 0)
        return this.bell();
      this.cursor = this.cursor - 1;
      this.render();
    }
    right() {
      if (this.cursor * this.scale >= this.rendered.length)
        return this.bell();
      this.cursor = this.cursor + 1;
      this.render();
    }
    renderOption(v, hovered, isStart, isEnd) {
      let desc;
      let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : " ";
      let title = hovered ? color.cyan().underline(v.title) : v.title;
      prefix = (hovered ? color.cyan(figures.pointer) + " " : "  ") + prefix;
      if (v.description) {
        desc = ` - ${v.description}`;
        if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
          desc = "\n" + wrap(v.description, { margin: 3, width: this.out.columns });
        }
      }
      return prefix + " " + title + color.gray(desc || "");
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText, this.out.columns));
      super.render();
      let { startIndex, endIndex } = entriesToDisplay(this.select, this.choices.length, this.limit);
      this.outputText = [
        style.symbol(this.done, this.aborted, this.exited),
        color.bold(this.msg),
        style.delimiter(this.completing),
        this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)
      ].join(" ");
      if (!this.done) {
        const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i) => this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join("\n");
        this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = AutocompletePrompt;
});

// node_modules/prompts/lib/elements/autocompleteMultiselect.js
var require_autocompleteMultiselect2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var { cursor } = require_src();
  var MultiselectPrompt = require_multiselect2();
  var { clear, style, figures } = require_util2();

  class AutocompleteMultiselectPrompt extends MultiselectPrompt {
    constructor(opts = {}) {
      opts.overrideRender = true;
      super(opts);
      this.inputValue = "";
      this.clear = clear("", this.out.columns);
      this.filteredOptions = this.value;
      this.render();
    }
    last() {
      this.cursor = this.filteredOptions.length - 1;
      this.render();
    }
    next() {
      this.cursor = (this.cursor + 1) % this.filteredOptions.length;
      this.render();
    }
    up() {
      if (this.cursor === 0) {
        this.cursor = this.filteredOptions.length - 1;
      } else {
        this.cursor--;
      }
      this.render();
    }
    down() {
      if (this.cursor === this.filteredOptions.length - 1) {
        this.cursor = 0;
      } else {
        this.cursor++;
      }
      this.render();
    }
    left() {
      this.filteredOptions[this.cursor].selected = false;
      this.render();
    }
    right() {
      if (this.value.filter((e) => e.selected).length >= this.maxChoices)
        return this.bell();
      this.filteredOptions[this.cursor].selected = true;
      this.render();
    }
    delete() {
      if (this.inputValue.length) {
        this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
        this.updateFilteredOptions();
      }
    }
    updateFilteredOptions() {
      const currentHighlight = this.filteredOptions[this.cursor];
      this.filteredOptions = this.value.filter((v) => {
        if (this.inputValue) {
          if (typeof v.title === "string") {
            if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
              return true;
            }
          }
          if (typeof v.value === "string") {
            if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) {
              return true;
            }
          }
          return false;
        }
        return true;
      });
      const newHighlightIndex = this.filteredOptions.findIndex((v) => v === currentHighlight);
      this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
      this.render();
    }
    handleSpaceToggle() {
      const v = this.filteredOptions[this.cursor];
      if (v.selected) {
        v.selected = false;
        this.render();
      } else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) {
        return this.bell();
      } else {
        v.selected = true;
        this.render();
      }
    }
    handleInputChange(c) {
      this.inputValue = this.inputValue + c;
      this.updateFilteredOptions();
    }
    _(c, key) {
      if (c === " ") {
        this.handleSpaceToggle();
      } else {
        this.handleInputChange(c);
      }
    }
    renderInstructions() {
      if (this.instructions === undefined || this.instructions) {
        if (typeof this.instructions === "string") {
          return this.instructions;
        }
        return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
      }
      return "";
    }
    renderCurrentInput() {
      return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray("Enter something to filter")}\n`;
    }
    renderOption(cursor2, v, i) {
      let title;
      if (v.disabled)
        title = cursor2 === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
      else
        title = cursor2 === i ? color.cyan().underline(v.title) : v.title;
      return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + "  " + title;
    }
    renderDoneOrInstructions() {
      if (this.done) {
        return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
      }
      const output = [color.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];
      if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) {
        output.push(color.yellow(this.warn));
      }
      return output.join(" ");
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      super.render();
      let prompt = [
        style.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style.delimiter(false),
        this.renderDoneOrInstructions()
      ].join(" ");
      if (this.showMinError) {
        prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
        this.showMinError = false;
      }
      prompt += this.renderOptions(this.filteredOptions);
      this.out.write(this.clear + prompt);
      this.clear = clear(prompt, this.out.columns);
    }
  }
  module.exports = AutocompleteMultiselectPrompt;
});

// node_modules/prompts/lib/elements/confirm.js
var require_confirm2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { style, clear } = require_util2();
  var { erase, cursor } = require_src();

  class ConfirmPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.value = opts.initial;
      this.initialValue = !!opts.initial;
      this.yesMsg = opts.yes || "yes";
      this.yesOption = opts.yesOption || "(Y/n)";
      this.noMsg = opts.no || "no";
      this.noOption = opts.noOption || "(y/N)";
      this.render();
    }
    reset() {
      this.value = this.initialValue;
      this.fire();
      this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    submit() {
      this.value = this.value || false;
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write("\n");
      this.close();
    }
    _(c, key) {
      if (c.toLowerCase() === "y") {
        this.value = true;
        return this.submit();
      }
      if (c.toLowerCase() === "n") {
        this.value = false;
        return this.submit();
      }
      return this.bell();
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText, this.out.columns));
      super.render();
      this.outputText = [
        style.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style.delimiter(this.done),
        this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)
      ].join(" ");
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = ConfirmPrompt;
});

// node_modules/prompts/lib/elements/index.js
var require_elements2 = __commonJS((exports, module) => {
  module.exports = {
    TextPrompt: require_text2(),
    SelectPrompt: require_select2(),
    TogglePrompt: require_toggle2(),
    DatePrompt: require_date2(),
    NumberPrompt: require_number2(),
    MultiselectPrompt: require_multiselect2(),
    AutocompletePrompt: require_autocomplete2(),
    AutocompleteMultiselectPrompt: require_autocompleteMultiselect2(),
    ConfirmPrompt: require_confirm2()
  };
});

// node_modules/prompts/lib/prompts.js
var require_prompts2 = __commonJS((exports) => {
  function toPrompt(type, args, opts = {}) {
    return new Promise((res, rej) => {
      const p = new el[type](args);
      const onAbort = opts.onAbort || noop;
      const onSubmit = opts.onSubmit || noop;
      const onExit = opts.onExit || noop;
      p.on("state", args.onState || noop);
      p.on("submit", (x) => res(onSubmit(x)));
      p.on("exit", (x) => res(onExit(x)));
      p.on("abort", (x) => rej(onAbort(x)));
    });
  }
  var $ = exports;
  var el = require_elements2();
  var noop = (v) => v;
  $.text = (args) => toPrompt("TextPrompt", args);
  $.password = (args) => {
    args.style = "password";
    return $.text(args);
  };
  $.invisible = (args) => {
    args.style = "invisible";
    return $.text(args);
  };
  $.number = (args) => toPrompt("NumberPrompt", args);
  $.date = (args) => toPrompt("DatePrompt", args);
  $.confirm = (args) => toPrompt("ConfirmPrompt", args);
  $.list = (args) => {
    const sep = args.separator || ",";
    return toPrompt("TextPrompt", args, {
      onSubmit: (str) => str.split(sep).map((s) => s.trim())
    });
  };
  $.toggle = (args) => toPrompt("TogglePrompt", args);
  $.select = (args) => toPrompt("SelectPrompt", args);
  $.multiselect = (args) => {
    args.choices = [].concat(args.choices || []);
    const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
    return toPrompt("MultiselectPrompt", args, {
      onAbort: toSelected,
      onSubmit: toSelected
    });
  };
  $.autocompleteMultiselect = (args) => {
    args.choices = [].concat(args.choices || []);
    const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
    return toPrompt("AutocompleteMultiselectPrompt", args, {
      onAbort: toSelected,
      onSubmit: toSelected
    });
  };
  var byTitle = (input, choices) => Promise.resolve(choices.filter((item) => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
  $.autocomplete = (args) => {
    args.suggest = args.suggest || byTitle;
    args.choices = [].concat(args.choices || []);
    return toPrompt("AutocompletePrompt", args);
  };
});

// node_modules/prompts/lib/index.js
var require_lib = __commonJS((exports, module) => {
  async function prompt(questions = [], { onSubmit = noop, onCancel = noop } = {}) {
    const answers = {};
    const override2 = prompt._override || {};
    questions = [].concat(questions);
    let answer, question, quit, name, type, lastPrompt;
    const getFormattedAnswer = async (question2, answer2, skipValidation = false) => {
      if (!skipValidation && question2.validate && question2.validate(answer2) !== true) {
        return;
      }
      return question2.format ? await question2.format(answer2, answers) : answer2;
    };
    for (question of questions) {
      ({ name, type } = question);
      if (typeof type === "function") {
        type = await type(answer, { ...answers }, question);
        question["type"] = type;
      }
      if (!type)
        continue;
      for (let key in question) {
        if (passOn.includes(key))
          continue;
        let value = question[key];
        question[key] = typeof value === "function" ? await value(answer, { ...answers }, lastPrompt) : value;
      }
      lastPrompt = question;
      if (typeof question.message !== "string") {
        throw new Error("prompt message is required");
      }
      ({ name, type } = question);
      if (prompts[type] === undefined) {
        throw new Error(`prompt type (${type}) is not defined`);
      }
      if (override2[question.name] !== undefined) {
        answer = await getFormattedAnswer(question, override2[question.name]);
        if (answer !== undefined) {
          answers[name] = answer;
          continue;
        }
      }
      try {
        answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : await prompts[type](question);
        answers[name] = answer = await getFormattedAnswer(question, answer, true);
        quit = await onSubmit(question, answer, answers);
      } catch (err) {
        quit = !await onCancel(question, answers);
      }
      if (quit)
        return answers;
    }
    return answers;
  }
  function getInjectedAnswer(injected, deafultValue) {
    const answer = injected.shift();
    if (answer instanceof Error) {
      throw answer;
    }
    return answer === undefined ? deafultValue : answer;
  }
  function inject(answers) {
    prompt._injected = (prompt._injected || []).concat(answers);
  }
  function override(answers) {
    prompt._override = Object.assign({}, answers);
  }
  var prompts = require_prompts2();
  var passOn = ["suggest", "format", "onState", "validate", "onRender", "type"];
  var noop = () => {
  };
  module.exports = Object.assign(prompt, { prompt, prompts, inject, override });
});

// node_modules/prompts/index.js
var require_prompts3 = __commonJS((exports, module) => {
  function isNodeLT(tar) {
    tar = (Array.isArray(tar) ? tar : tar.split(".")).map(Number);
    let i = 0, src = process.versions.node.split(".").map(Number);
    for (;i < tar.length; i++) {
      if (src[i] > tar[i])
        return false;
      if (tar[i] > src[i])
        return true;
    }
    return false;
  }
  module.exports = isNodeLT("8.6.0") ? require_dist() : require_lib();
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
var require_util3 = __commonJS((exports, module) => {
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
  } = require_util3();
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

// node_modules/commander/esm.mjs
var import_ = __toESM(require_commander(), 1);
var {
  program,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  Command,
  Argument,
  Option,
  Help
} = import_.default;

// clients/cli/core/Main.ts
var import_prompts2 = __toESM(require_prompts3(), 1);
var import_chalk4 = __toESM(require_source(), 1);

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

// clients/cli/displayers/PromptDisplayer.ts
var import_chalk2 = __toESM(require_source(), 1);

class PromptDisplayer {
  showHelp(choides) {
    let help = `${import_chalk2.default.greenBright("\n\tHappy cast !!!\n\n")}`;
    for (let i = 0;i < choides.length; i++) {
      const choice = choides[i];
      help = help.concat(`[${import_chalk2.default.green(choice.name)}]: ${choice.description}`, "\n");
    }
    return help;
  }
}

// clients/cli/controllers/CLIController.ts
var import_prompts = __toESM(require_prompts3(), 1);
var import_chalk3 = __toESM(require_source(), 1);
import {exit as exit2} from "process";

// clients/cli/core/Logger.ts
class Logger {
  content;
  static instance;
  constructor() {
    this.content = "";
  }
  log(content = "") {
    this.clear();
    this.content = content;
    this.display(this.content);
  }
  append(line = "") {
    this.clear();
    this.content = this.content.concat("\n", line);
    this.display(this.content);
  }
  get getContent() {
    return this.content;
  }
  clear() {
    console.clear();
  }
  display(content) {
    console.log(content);
  }
  static create() {
    if (Logger.instance) {
      return Logger.instance;
    }
    Logger.instance = new Logger;
    console.log("Logger.instance", Logger.instance);
    return Logger.instance;
  }
}

// clients/cli/config/prompt.ts
var choices = [
  { name: "e", description: "Edit user name" },
  { name: "c", description: "Create a query search" },
  { name: "r", description: "Resend all queries" },
  { name: "d", description: "Delete a query search" },
  { name: "i", description: "Display informations" },
  { name: "s", description: "Show all searchs" },
  { name: "q", description: "Quit" }
];
var questions = [
  {
    type: "text",
    name: "choice",
    message: "What do you want to do ?"
  }
];
var edits = [
  {
    type: "text",
    name: "username",
    message: "What is your new name ?"
  },
  {
    type: (prev) => prev.trim() !== "" ? "toggle" : null,
    name: "confirmation",
    message: "Can you confirm ?",
    initial: true,
    active: "yes",
    inactive: "no"
  }
];
var news = [
  {
    type: "text",
    name: "name",
    message: "What is the name of your search ?"
  },
  {
    type: (prev) => prev.toString().trim() !== "" ? "list" : null,
    name: "keys",
    message: "Enter keywords",
    initial: "",
    separator: ","
  },
  {
    type: (prev) => prev.toString().trim() !== "" ? "select" : null,
    name: "extension",
    message: "What is the file extension ?",
    choices: [
      { title: "Audio", value: ".mp3" },
      { title: "Video", value: ".mp4" },
      { title: "Document", value: ".pdf" }
    ],
    initial: 1
  },
  {
    type: (prev) => prev.toString().trim() !== "" ? "toggle" : null,
    name: "confirmation",
    message: "Can you confirm ?",
    initial: true,
    active: "yes",
    inactive: "no"
  }
];
var renews = [
  {
    type: "toggle",
    name: "confirmation",
    message: "Do you really want to resend all searchs ?",
    initial: false,
    active: "yes",
    inactive: "no"
  }
];
var deletions = (choices2) => {
  return [
    {
      type: "select",
      name: "slug",
      message: "What search do you want to delete ?",
      choices: [
        ...choices2.map((choice) => {
          return { title: choice.name, value: choice.value, description: choice.value };
        }),
        { title: "return", value: "undo", description: "Do nothing" }
      ],
      initial: 1
    },
    {
      type: (prev) => prev !== "undo" ? "toggle" : null,
      name: "cfm",
      message: "Can you confirm deletion?",
      initial: false,
      active: "yes",
      inactive: "no"
    }
  ];
};
var delete_nothing = [
  {
    type: "text",
    name: "wanna_quit",
    message: "Quit"
  }
];
var infos = [
  {
    type: "text",
    name: "wanna_quit",
    message: "Quit"
  }
];

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

// clients/cli/controllers/CLIController.ts
class CLIController {
  static logger = Logger.create();
  async edit(data) {
    CLIController.logger.log(import_chalk3.default.underline.blue("\tEditing\n"));
    const response = await import_prompts.default(edits);
    if (response.confirmation) {
      const identity = new IdentityFacade;
      identity.update(response.username);
    }
    return 0;
  }
  async create() {
    try {
      CLIController.logger.log(import_chalk3.default.underline.blue("\tCreate search request\n"));
      const inputs = await import_prompts.default(news);
      const search2 = new SearchFacade;
      search2.create({ name: inputs.name, content: [{ keys: [...inputs.keys], extension: inputs.extension }] });
      return 0;
    } catch (error) {
      return 1;
    }
  }
  async resend() {
    try {
      const inputs = await import_prompts.default(renews);
      const search2 = new SearchFacade;
      if (inputs.confirmation) {
        search2.resend();
      }
      return 0;
    } catch (error) {
      return 1;
    }
  }
  async remove() {
    try {
      CLIController.logger.log(import_chalk3.default.underline.blue("\tDelete a search request\n"));
      const search2 = new SearchFacade;
      const searchs = search2.getAll().map((value) => {
        return { name: value.getname(), value: value.getslug() };
      });
      if (searchs.length === 0) {
        await CLIController.onDeleteNothing();
        return 0;
      }
      const config2 = deletions(searchs);
      const inputs = await import_prompts.default(config2);
      if (inputs.cfm) {
        search2.delete(inputs.slug);
      }
      return 0;
    } catch (error) {
      return 1;
    }
  }
  async info() {
    try {
      CLIController.logger.log(import_chalk3.default.underline.blue("\tInformations\n"));
      const identity = new IdentityFacade;
      const infos2 = identity.get();
      CLIController.logger.append(`
            ${import_chalk3.default.bold.bgBlue.whiteBright(" Name ")}: ${import_chalk3.default.blueBright(infos2.getname())}
            ${import_chalk3.default.bold.bgGray.whiteBright(" IP address ")}: ${import_chalk3.default.whiteBright(infos2.getipv4())}
            ${import_chalk3.default.bold.bgMagenta.whiteBright(" MAC address ")}: ${import_chalk3.default.magentaBright(infos2.getphysicalAddress())}`);
      const back = await import_prompts.default(infos);
      return 0;
    } catch (error) {
      return 1;
    }
  }
  async showAllSearch() {
    CLIController.logger.log(import_chalk3.default.underline.blue("\tAll search query\n"));
    const searchs = new SearchFacade().getAll();
    if (searchs.length === 0) {
      CLIController.logger.append(import_chalk3.default.redBright("\n\t\tNothing to show\n"));
    }
    CLIController.displayAllSearch(searchs);
    const back = await import_prompts.default(infos);
    return 0;
  }
  async quit() {
    CLIController.logger.append(import_chalk3.default.cyanBright("\nPeace ;) \n"));
    exit2(0);
    return 0;
  }
  static async onDeleteNothing() {
    CLIController.logger.append(import_chalk3.default.redBright("\t\tNothing to delete\n"));
    await import_prompts.default(delete_nothing);
  }
  static displayAllSearch(searchs) {
    searchs.forEach((search2) => {
      CLIController.logger.append(`\n\t ${import_chalk3.default.italic.blueBright(search2.getname())} (${search2.getfounders().length} result(s)) - ${import_chalk3.default.gray(search2.slug)}`);
    });
    CLIController.logger.append("\n");
  }
}

// clients/cli/core/Router.ts
var import_typedi7 = __toESM(require_cjs(), 1);
class Router {
  routes = [];
  addRoute(eventName, controller) {
    this.routes.push({ eventName, controller });
  }
  removeRoute(eventName) {
    this.routes = this.routes.filter((route) => route.eventName !== eventName);
  }
  async triggerEvent(eventName, ...args) {
    const route = this.routes.find((route2) => route2.eventName === eventName);
    if (route) {
      return await route.controller(...args);
    } else {
      console.warn(`Action '${eventName}' not found`);
      return 1;
    }
  }
}
Router = __legacyDecorateClassTS([
  import_typedi7.Service()
], Router);

// clients/cli/prompt_routers/route.ts
var router3 = new Router;
var { edit, create, resend, remove, info, showAllSearch, quit } = new CLIController;
router3.addRoute("e", edit);
router3.addRoute("c", create);
router3.addRoute("r", resend);
router3.addRoute("d", remove);
router3.addRoute("i", info);
router3.addRoute("s", showAllSearch);
router3.addRoute("q", quit);

// clients/cli/core/Main.ts
class Main {
  async start() {
    const system = new System;
    const displayer = new PromptDisplayer;
    const logger = Logger.create();
    await system.init();
    let lastaction = "";
    let code = 0;
    AppEvent.create().on("found").then(function() {
      console.log("foundddddddd");
    });
    while (true) {
      const help = displayer.showHelp(choices);
      lastaction && Main.displayHeader(lastaction, code);
      logger.append(help);
      const response = await import_prompts2.default(questions);
      code = await router3.triggerEvent(response.choice);
      lastaction = response.choice;
    }
  }
  static verifyChoice(choices2, choice) {
    return choices2.map((choice2) => choice2.name).includes(choice);
  }
  static displayHeader(lastaction, code) {
    const logger = Logger.create();
    if (code > 0) {
      logger.log(import_chalk4.default.redBright(`\tx action [${import_chalk4.default.blueBright(lastaction)}] does not success`));
    } else {
      logger.log(import_chalk4.default.greenBright(`	\u2714 your last action was [${import_chalk4.default.blueBright(lastaction)}]`));
    }
    console.log(lastaction);
  }
}

// clients/cli/Ar.ts
program.description("This program start the Ar-multicast app").command("start").description("Start Ar-multicast system").action(new Main().start);
program.parse();
