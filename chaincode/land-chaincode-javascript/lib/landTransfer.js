"use strict";

const { Contract } = require("fabric-contract-api");

class LandTransfer extends Contract {
  async InitLedger(ctx) {
    const lands = [
      {
        ULPIN: "1",
        Length: 40,
        Breadth: 40,
        Area: 1600,
        Latitude: 44.5,
        Longitude: 14.5,
        Owner: "Sanjay",
        ForSale: true,
        Adress: "AS Layout Bangalore,India",
      },
      {
        ULPIN: "2",
        Length: 40,
        Breadth: 40,
        Area: 1600,
        Latitude: 24.5,
        Longitude: 14.5,
        Owner: "Dave",
        ForSale: true,
        Adress: "ES Layout Bangalore,India",
      },
      {
        ULPIN: "1",
        Length: 40,
        Breadth: 40,
        Area: 1600,
        Latitude: 44.4,
        Longitude: 14.5,
        Owner: "MAT",
        ForSale: true,
        Address: "LS Layout Bangalore,India",
      },
    ];

    for (var  land of lands) {
      land.LandType = 'residential';
      await ctx.stub.putState(land.ULPIN, Buffer.from(JSON.stringify(land)));
      console.info(`Land ${land.ULPIN} added`);
    }
    //console.info(' chaincode init function')
  }

  async InsertLand(
    ctx,
    ulpin,
    length,
    breadth,
    latitude,
    longitude,
    owner,
    forSale,
    address,
    landType
  ) {
    const area = length * breadth;
    const land = {
      ULPIN: ulpin,
      Length: length,
      Breadth: breadth,
      Area: area,
      Latitude: latitude,
      Longitude: longitude,
      Owner: owner,
      ForSale: forSale,
      Address: address,
      LandType: landType,
    };
    await ctx.stub.putState(land.ULPIN, Buffer.from(JSON.stringify(land)));
    return JSON.stringify(land);
  }

  async ReadLand(ctx, ulpin) {
    const landJSON = await ctx.stub.getState(ulpin);
    if (!landJSON || landJSON.length === 0) {
      throw new Error(`The Land with ${ulpin} doesn't exist`);
    }
    return landJSON.toString();
  }

  async BuyLand(ctx, ulpin, newOwner) {
    const landString = await this.ReadLand(ctx, ulpin);
    const land = JSON.parse(landString);
    land.Owner = newOwner;
    return ctx.stub.putState(land.ULPIN, Buffer.from(JSON.stringify(land)));
  }

  async GetAllAssets(ctx) {
    const allResult = [];
    // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push({ Key: result.value.key, Record: record });
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }
}

module.exports = LandTransfer;
