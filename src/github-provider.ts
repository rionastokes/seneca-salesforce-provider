/* Copyright © 2021 Seneca Project Contributors, MIT License. */

import * as jsforce from "jsforce";
import * as fs from "fs";
import * as path from "path";

//Access salesforce credentials
const cred = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../cred.json")).toString()
);

//Use static class to call multiple scripts, to reduce redundant code involved with opening and closing Salesforce connections
export abstract class SalesforceConnection {
  constructor() {}

  /** Opens a new connection to Salesforce instance using settings from cred. */
  public static async open(): Promise<jsforce.Connection> {
    let conn = new jsforce.Connection({
      loginUrl: cred.instance_url,
    });
    await conn.login(cred.username, cred.password);
    console.log("ConnectedSalesforce.");
    return conn;
  }

  /** Closes an existing connection to Salesforce. */
  public static async close(conn: any): Promise<void> {
    await conn.logout();
    console.log("Closed Connection to Salesforce.");
    return;
  }
}

//Updating data in salesforce

const soql = `
    SELECT Id,
    Name
    FROM Account`;

//Query data from Salesforce
async () => {
  const conn = await SalesforceConnection.open();
  const accounts = await conn.query(soql);
  console.log(`${accounts.totalSize} records returned from Salesforce.`);

  const accountToUpdate: any = accounts.records.find(
    (x: any) => x.Name === "Testing Account Name" //This is an actual acc name from your salesforce connected app
  );

  //Update & save some fields record on the Account entity
  if (accountToUpdate) {
    const resp: any = await conn
      .sobject("Account")
      .update({ Id: accountToUpdate.Id, Name: "Voxgig Tech Comp" }); 
    console.log(resp);
    if (resp.success) {
      console.log(`Record with id ${resp.id} updated successfully.`);
    } else {
      console.error(resp.errors[0]);
    }
  }
  SalesforceConnection.close(conn);
};
