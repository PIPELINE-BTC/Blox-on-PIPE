import { Collection, MongoClient } from "mongodb";
import { Long } from "bson";

export class Blox {
  private client!: MongoClient;
  private pipeBlocks!: Collection;
  private alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private blocksToken: Set<number> = new Set();
  private blocks: any[] = [];
  private blockHeader = "BLOX";
  private methodSupported = new Set([
    "P",
  ]);
  private currentBlock: number = 0;
  private blockTxid = new Set<string>();
  private blockData: any[] = [];
  private blockVSize: bigint = BigInt(0);
  private pipeGenesis = 809608;
  public pipeBlock = 0;

  public async initialize(
    uri: string,
    db: string,
    collection: string,
  ) {
    this.client = await MongoClient.connect(uri);
    this.pipeBlocks = this.client.db(db).collection(collection);
  }

  public async load(block: number) {
    const blocksRaw = await this.pipeBlocks.find({
      type: "b",
    }).toArray();

    this.blocks = blocksRaw;
    const blocksHeight = blocksRaw.filter((b: any) => b.t !== undefined).map((b: any) =>
      b.b
    );
    this.blocksToken = new Set(blocksHeight);

    this.currentBlock = block;
    this.pipeBlock = block - this.pipeGenesis;
    this.blockVSize = BigInt(0);
    this.blockTxid.clear();
    this.blockData = [];
  }

  public async indexAction(data: any) {
    try {
      if (!this.blockTxid.has(data.txid)) {
        this.blockVSize += BigInt(data.vsize);
      }

      data.b = this.pipeBlock;
      data.bb = this.currentBlock;

      this.blockData.push(data);
      this.blockTxid.add(data.txid);
      if (data.type === "d") {
        await this.indexToken(data);
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async indexBlock() {

    const data = {
      type: "b",
      b: this.pipeBlock,
      bb: this.currentBlock,
      size: Long.fromBigInt(this.blockVSize),
      txs: this.blockData.length
    };

    try {
      await this.safeDatabaseOperation(() => this.pipeBlocks.insertOne(data));

      if (this.blockData.length > 0) {
        await this.safeDatabaseOperation(() =>
          this.pipeBlocks.insertMany(this.blockData)
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  private async indexToken(data: any) {
    try {
      const blockRaw = (data.tick as string).toUpperCase();
      const blockHeader = blockRaw.substring(0, 4);
      const blockType = blockRaw.substring(4, 5);
      const blockHeight = blockRaw.substring(5);

      if (data.dec !== 8) {
        // throw "DEC";
        return;
      }

      if (
        blockHeader !== this.blockHeader
      ) {
        // throw "blockHeader";
        return;
      }

      if (!this.methodSupported.has(blockType)) {
        // throw "Not Supported";
        return;
      }

      const decodedBlockHRaw = this.decodeBase26(blockHeight);
      if (decodedBlockHRaw === null) {
        // throw "decodedBlockHRaw";
        return;
      }

      let currentB = this.currentBlock;
      let decodedBlockH = decodedBlockHRaw;

      switch (blockType) {
        case "P":
          currentB = this.currentBlock - (this.pipeGenesis);
          break;
      }

      if (decodedBlockH >= currentB) {
        // throw "currentB";
        return;
      }

      if (this.blocksToken.has(decodedBlockH)) {
        // throw "blocksToken";
        return;
      }

      const blockData = this.blocks.filter((b) => b.b === decodedBlockH);

      if (blockData.length !== 1) {
        // throw "ERROR with " + decodedBlockH + "data";
        return;
      }

      let blockSize = Long.fromString(blockData[0].size.toString());
      blockSize = blockSize.multiply(Long.fromString('100000000')); // DEC 8

      if (blockSize.equals(0)) {
        blockSize = Long.fromInt(100000000);
      }

      if (!blockSize.equals(data.value)) {
        // throw "data.max";
        return;
      }

      await this.safeDatabaseOperation(() =>
        this.pipeBlocks.updateOne({ _id: blockData[0]._id }, {
          $set: { t: blockRaw, tid: data.id, th: this.currentBlock },
        })
      );
      this.blocksToken.add(decodedBlockH);
    } catch (e) {
      console.log(e);
    }

  }

  private async safeDatabaseOperation(operation: () => Promise<any>) {
    try {
      await operation();
    } catch (error) {
      console.error("Error on first try:", error);
      try {
        await operation();
      } catch (error) {
        console.error("Error on second try:", error);
        throw error;
      }
    }
  }

  public encodeBase26(num: number) {
    if (num === 0) return "A";
    let result = "";
    while (num > 0) {
      const remainder = num % 26;
      result = this.alphabet[remainder] + result;
      num = Math.floor(num / 26);
    }
    return result;
  }

  public decodeBase26(str: string): number | null {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      const charIndex = this.alphabet.indexOf(str[i]);
      if (charIndex === -1) {
        return null;
      }
      result = result * 26 + charIndex;
    }
    return result;
  }
}