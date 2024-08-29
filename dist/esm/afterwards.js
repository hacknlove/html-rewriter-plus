"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAfterWards = runAfterWards;
async function runAfterWards(context, inputResponse, afterwards) {
    let outputResponse = new Response(inputResponse.body, inputResponse);
    for (const afterwardFunction of afterwards) {
        outputResponse =
            (await afterwardFunction(context, outputResponse)) || outputResponse;
    }
    return outputResponse;
}
