/* Copyright © 2021 Seneca Project Contributors, MIT License. */

import * as jsforce from 'jsforce';
import * as fs from 'fs';
import * as path from 'path';


//Access salesforce credentials
const cred = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../cred.json')).toString())
