const colorsKeys = {
    黒: "\u001b[30m",
    赤: "\u001b[31m",
    緑: "\u001b[32m",
    黄: "\u001b[33m",
    青: "\u001b[34m",
    マゼンタ: "\u001b[35m",
    シアン: "\u001b[36m",
    白: "\u001b[37m",
    "/": "\u001b[0m",
    黒背景: "\u001b[40m",
    赤背景: "\u001b[41m",
    緑背景: "\u001b[42m",
    黄背景: "\u001b[43m",
    青背景: "\u001b[44m",
    マゼンタ背景: "\u001b[45m",
    シアン背景: "\u001b[46m",
    白背景: "\u001b[47m",
    アンダーライン: "\u001b[4m",
};

exports.Logger = class Logger {
    constructor() {}

    print(message) {
        if (typeof message === "string") {
            process.stdout.write(message);
        } else if (typeof message === "number") {
            process.stdout.write(colorsKeys["青"] + message + colorsKeys["/"]);
        } else if (typeof message === "object") {
            process.stdout.write(JSON.stringify(message));
        } else if (typeof message === "boolean") {
            if (message) {
                process.stdout.write(colorsKeys["青"] + "true" + colorsKeys["/"]);
            } else {
                process.stdout.write(colorsKeys["赤"] + "false" + colorsKeys["/"]);
            }
        } else if (typeof message === "undefined") {
            process.stdout.write(colorsKeys["青"] + "undefined" + colorsKeys["/"]);
        } else {
            process.stdout.write(message);
        }
    }
    debug(...args) {
        process.stdout.write(colorsKeys["青"] + "| D |" + colorsKeys["/"]);
        for (const [index, message] of args.entries()) {
            process.stdout.write(" ");
            this.print(message);
        }
        process.stdout.write("\n");
    }

    info(...args) {
        process.stdout.write(colorsKeys["緑"] + "| I |" + colorsKeys["/"]);
        for (const [index, message] of args.entries()) {
            process.stdout.write(" ");
            this.print(message);
        }
        process.stdout.write("\n");
    }

    warning(...args) {
        process.stdout.write(colorsKeys["黄"] + "| W |" + colorsKeys["/"]);
        for (const [index, message] of args.entries()) {
            process.stdout.write(" ");
            this.print(message);
        }
        process.stdout.write("\n");
    }
    error(...args) {
        process.stdout.write(colorsKeys["赤"] + "| E |" + colorsKeys["/"]);
        for (const [index, message] of args.entries()) {
            process.stdout.write(" ");
            this.print(message);
        }
        process.stdout.write("\n");
    }
};
