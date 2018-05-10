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

import _ from 'lodash';

export default class DataTransformer {
  constructor(logger) {
    this.logger = logger || console;
  }

  /*
    Given a list of objects; iterates over each element and
    adds/update field values to have correct references to other field
    e.g. if firstName=Adam, lastName=Smith, email=Adam.Smith@gmail.com
  */
  addReferentialIntegrity(data) {
    if (!data) return;
    // add gene names reference
    _.forEach(data, model => {
      _.forEach(model.variants, item => {
        // length is min 1 and max 2
        item.genes.gene_symbol.length == 1 ?
          item.name = item.genes.gene_symbol[0] :
          item.name = item.genes.gene_symbol[0] + "-" + item.genes.gene_symbol[1];
      });
    });
  }

  /*
    Transforms parent->children to child->parents by filtering whole data
  */
  transformParentChildRelation(data) {
    return _.reduce(data, (variants, model, key) => {
      // iterate over each model
      _.each(model.variants, (variant) => {
        // check if variant is already available in result
        let outputVariant = _.filter(variants, ['name', variant.name]);
        outputVariant = outputVariant.length == 0 ? (variants.push(variant), variant) : outputVariant[0];
        // add current model to variant's model collection
        // remove model's variants prop before adding model as a child
        (outputVariant.models || (outputVariant.models = [])).push(_.omit(model, ['variants']));
      })
      return variants;
    }, []);
  }
}