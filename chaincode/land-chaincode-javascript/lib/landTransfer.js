"use strict";

const { Contract } = require("fabric-contract-api");

class LandTransfer extends Contract {
  async InitLedger(ctx) {
    const lands = [
      {
        ULPIN: "land1",
        Length: 40,
        Breadth: 40,
        Area: 1600,
        Latitude: 44.5,
        Longitude: 14.5,
        Owner: "Sanjay",
        ForSale: true,
        Adress: "AS Layout Bangalore,India",
        District: "Bangalore",
        SubDistrict: "Bangalore North",
      },
      {
        ULPIN: "land2",
        Length: 40,
        Breadth: 40,
        Area: 1600,
        Latitude: 24.5,
        Longitude: 14.5,
        Owner: "Dave",
        ForSale: true,
        Adress: "ES Layout Bangalore,India",
        District: "Bangalore",
        SubDistrict: "Bangalore South",
      },
      {
        ULPIN: "land3",
        Length: 40,
        Breadth: 40,
        Area: 1600,
        Latitude: 44.4,
        Longitude: 14.5,
        Owner: "MAT",
        ForSale: true,
        Address: "LS Layout Bangalore,India",
        District: "Bangalore",
        SubDistrict: "Bangalore South",
      },
    ];

    for (var land of lands) {
      land.LandType = "residential";
      await this.InsertLand(
        ctx,
        land.ULPIN,
        land.Length,
        land.Breadth,
        land.Latitude,
        land.Longitude,
        land.Owner,
        land.ForSale,
        land.Address,
        land.District,
        land.SubDistrict,
        land.LandType
      );

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
    district,
    subDistrict,
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
      District: district,
      SubDistrict: subDistrict,
      LandType: landType,
    };
    const landExist = await this.LandExist(ctx, ulpin);
    if (landExist) {
      throw new Error(`The land with ${ulpin} already exists`);
    }
    console.info('Insert Land Method')
    console.info(land);
    await ctx.stub.putState(land.ULPIN, Buffer.from(JSON.stringify(land)));
    let compositeKey = await ctx.stub.createCompositeKey(landType, [ulpin,district,subDistrict]);
    await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(land)));
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

  async GetAllLandRecords(ctx) {
    const allResult = [];
    // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    const iteratorPromise = ctx.stub.getStateByRange("", "");
    let results = [];
    for await (const res of iteratorPromise) {
      results.push({
        key: res.key,
        value: res.value.toString(),
      });
    }

    return JSON.stringify(results);
  }
   async getLandByType(ctx, landType) {
    const iteratorPromise = ctx.stub.getStateByPartialCompositeKey(
      landType,
      []
    );
    let results = [];

    for await (const res of iteratorPromise) {
      const splitKey = ctx.stub.splitCompositeKey(res.key);
      results.push({
        ULPIN: splitKey.ULPIN,
        value: res.value.toString()

      })
    }
  }

  // _createCompositeKey(ctx, landType, ulpin) {
  //   if (ulpin || ulpin === "") {
  //     throw new Error("ulpin should be a non-empty string");
  //   }
  //   if (landType === "") {
  //     return ulpin;
  //   }
  //   return ctx.stub.createCompositeKey(landType, [ulpin]);
  // }

  // returns true if the land exists with ULPIN and has values in it
  async LandExist(ctx, ulpin) {
    let landJson = await ctx.stub.getState(ulpin);
    return landJson && landJson.length > 0;
  }
}

module.exports = LandTransfer;

// let indexName = 'color~name';
// let colorNameIndexKey = await ctx.stub.createCompositeKey(indexName, [asset.color, asset.assetID]);
