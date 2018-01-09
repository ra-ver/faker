/**
 *
 * Copyright (c) 2017 The Ontario Institute for Cancer Research. All rights reserved.
 *
 * This program and the accompanying materials are made available under the terms of the GNU Public License v3.0.
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

"use strict";
import _ from 'lodash';
import babelPolyfill from 'babel-polyfill';

export default class SchemaTransformer {
    constructor(logger){
        logger == null ? this.logger = console : this.logger = logger;
    }
    async transform(schemaObject){
        if(! schemaObject.hasOwnProperty("type")) return;
        // if type is object
        if(schemaObject["type"] == "object"){
            await this.addRequiredProps(schemaObject, [], true);
            // transform objects in properties (anything that is not an object or array will be skipped)
            _.forEach(schemaObject["properties"], item => this.transform(item));
        }
        // if type is array
        else if(schemaObject["type"] == "array"){
            if(! schemaObject.hasOwnProperty("items"))
                throw Error("Invalid Schema object. No items found.");
            _.forEach(schemaObject["items"], item => this.transform(item));
        }
    }
    /*
         given a JSON object with "properties"
         adds a required list of properties based on provided requiredprops
         If no requiredProps are specified then all the props are set to required
      */
    async addRequiredProps(schemaObject, requiredProps){
        if(! schemaObject.hasOwnProperty("properties"))
            throw Error("Invalid Schema object. No properties found.");
        if(typeof requiredProps == "undefined" || requiredProps.length == 0) {
            // add all props as required
            let props = _.keys(schemaObject["properties"]);
            if(! schemaObject.hasOwnProperty("required"))
                    schemaObject["required"] = [];

            // add required props
            schemaObject["required"] = _.union(schemaObject["required"], props);
        }
    }
}