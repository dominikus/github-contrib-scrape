"use strict";

/* 
Downloads a user's github contribution history image, parses it and outputs it as csv.

somewhat based on https://github.com/akerl/githubstats/blob/master/lib/githubstats.rb 
*/

const url = require('url');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const repl = require('repl');

const BASE_URL = "http://www.github.com/";

const DEFAULT_USER_NAME = "dominikus";
const DEFAULT_OUTPUT_FILE = 'contributions.csv';

// parse command line parameters:
var args = process.argv.slice(2);
var user_name = DEFAULT_USER_NAME;
var output_file = DEFAULT_OUTPUT_FILE

if(args.length >= 1){
    user_name = args[0];
} 
if(args.length >= 2){
    output_file = args[1];
}
const USER_PARAM = `/users/${user_name}/contributions`;


var baseUrl = BASE_URL + USER_PARAM;

var fetchPage = function(_url, callback){
    request(_url, (status, error, body) => {
        var $ = cheerio.load(body);
        var data = "";
        $('[data-date]').each(function(i, el) {
            data += `${$(this).attr('data-date')},${$(this).attr('data-count')}`;
            if(i < $('[data-date]').length - 1){
                data += '\n';
            }
        });
        callback(data);
    });
}

var storeContribs = (data) => {
    fs.writeFile(output_file, data);
};

// go:
fetchPage(baseUrl, (result) => {
    storeContribs(result);
});