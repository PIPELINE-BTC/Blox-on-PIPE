"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blox = void 0;
var mongodb_1 = require("mongodb");
var bson_1 = require("bson");
var Blox = /** @class */ (function () {
    function Blox() {
        this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.blocksToken = new Set();
        this.blocks = [];
        this.blockHeader = "BLOX";
        this.methodSupported = new Set([
            "P",
        ]);
        this.currentBlock = 0;
        this.blockTxid = new Set();
        this.blockData = [];
        this.blockVSize = BigInt(0);
        this.pipeGenesis = 809608;
        this.pipeBlock = 0;
    }
    Blox.prototype.initialize = function (uri, db, collection) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(uri)];
                    case 1:
                        _a.client = _b.sent();
                        this.pipeBlocks = this.client.db(db).collection(collection);
                        return [2 /*return*/];
                }
            });
        });
    };
    Blox.prototype.load = function (block) {
        return __awaiter(this, void 0, void 0, function () {
            var blocksRaw, blocksHeight;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pipeBlocks.find({
                            type: "b",
                        }).toArray()];
                    case 1:
                        blocksRaw = _a.sent();
                        this.blocks = blocksRaw;
                        blocksHeight = blocksRaw.filter(function (b) { return b.t !== undefined; }).map(function (b) {
                            return b.b;
                        });
                        this.blocksToken = new Set(blocksHeight);
                        this.currentBlock = block;
                        this.blockVSize = BigInt(0);
                        this.blockTxid.clear();
                        this.blockData = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    Blox.prototype.indexAction = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!this.blockTxid.has(data.txid)) {
                            this.blockVSize += BigInt(data.vsize);
                        }
                        data.b = this.pipeBlock;
                        data.bb = this.currentBlock;
                        this.blockData.push(data);
                        this.blockTxid.add(data.txid);
                        if (!(data.type === "d")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.indexToken(data)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Blox.prototype.indexBlock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            type: "b",
                            b: this.pipeBlock,
                            bb: this.currentBlock,
                            size: bson_1.Long.fromBigInt(this.blockVSize),
                            txs: this.blockData.length
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.safeDatabaseOperation(function () { return _this.pipeBlocks.insertOne(data); })];
                    case 2:
                        _a.sent();
                        if (!(this.blockData.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.safeDatabaseOperation(function () {
                                return _this.pipeBlocks.insertMany(_this.blockData);
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        this.pipeBlock += 1;
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Blox.prototype.indexToken = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var blockRaw_1, blockHeader, blockType, blockHeight, decodedBlockHRaw, currentB, decodedBlockH_1, blockData_1, blockSize, e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        blockRaw_1 = data.tick.toUpperCase();
                        blockHeader = blockRaw_1.substring(0, 4);
                        blockType = blockRaw_1.substring(4, 5);
                        blockHeight = blockRaw_1.substring(5);
                        if (data.dec !== 8) {
                            // throw "DEC";
                            return [2 /*return*/];
                        }
                        if (blockHeader !== this.blockHeader) {
                            // throw "blockHeader";
                            return [2 /*return*/];
                        }
                        if (!this.methodSupported.has(blockType)) {
                            // throw "Not Supported";
                            return [2 /*return*/];
                        }
                        decodedBlockHRaw = this.decodeBase26(blockHeight);
                        if (decodedBlockHRaw === null) {
                            throw "decodedBlockHRaw";
                            return [2 /*return*/];
                        }
                        currentB = this.currentBlock;
                        decodedBlockH_1 = decodedBlockHRaw;
                        switch (blockType) {
                            case "P":
                                currentB = this.currentBlock - (this.pipeGenesis);
                                break;
                        }
                        if (decodedBlockH_1 >= currentB) {
                            // throw "currentB";
                            return [2 /*return*/];
                        }
                        if (this.blocksToken.has(decodedBlockH_1)) {
                            // throw "blocksToken";
                            return [2 /*return*/];
                        }
                        blockData_1 = this.blocks.filter(function (b) { return b.b === decodedBlockH_1; });
                        if (blockData_1.length !== 1) {
                            // throw "ERROR with " + decodedBlockH + "data";
                            return [2 /*return*/];
                        }
                        blockSize = bson_1.Long.fromString(blockData_1[0].size.toString());
                        blockSize = blockSize.multiply(bson_1.Long.fromString('100000000')); // DEC 8
                        if (blockSize.equals(0)) {
                            blockSize = bson_1.Long.fromInt(100000000);
                        }
                        if (!blockSize.equals(data.value)) {
                            // throw "data.max";
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.safeDatabaseOperation(function () {
                                return _this.pipeBlocks.updateOne({ _id: blockData_1[0]._id }, {
                                    $set: { t: blockRaw_1, tid: data.id, th: _this.currentBlock },
                                });
                            })];
                    case 1:
                        _a.sent();
                        this.blocksToken.add(decodedBlockH_1);
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        console.log(e_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Blox.prototype.safeDatabaseOperation = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 7]);
                        return [4 /*yield*/, operation()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error on first try:", error_1);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, operation()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.error("Error on second try:", error_2);
                        throw error_2;
                    case 6: return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Blox.prototype.encodeBase26 = function (num) {
        if (num === 0)
            return "A";
        var result = "";
        while (num > 0) {
            var remainder = num % 26;
            result = this.alphabet[remainder] + result;
            num = Math.floor(num / 26);
        }
        return result;
    };
    Blox.prototype.decodeBase26 = function (str) {
        var result = 0;
        for (var i = 0; i < str.length; i++) {
            var charIndex = this.alphabet.indexOf(str[i]);
            if (charIndex === -1) {
                return null;
            }
            result = result * 26 + charIndex;
        }
        return result;
    };
    return Blox;
}());
exports.Blox = Blox;
