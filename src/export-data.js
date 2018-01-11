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

import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import axios from 'axios';

export default class DataExporter {
  constructor(logger) {
    this.logger = logger || console;
  }
  write(targetDir, inputFileName, data) {
    if (targetDir == null) {
      reject('No directory specified.');
    }

    if (!fs.existsSync(targetDir)) {
      reject('Invalid path specified.');
    }

    let fileName = _.trim(inputFileName, '.json') + '-output.json';

    fs.writeFile(
      targetDir + path.sep + fileName,
      JSON.stringify(data),
      error => {
        if (error) {
          this.logger.error('Error writing file: ' + fileName);
          this.logger.error(error);
        } else
          this.logger.info(`Exported data to :${fileName} in ${targetDir}`);
      },
    );
  }
  writeToES(data) {
    // writing one by one to avoid hitting payload limit
    data.forEach(async (item, index) => {
      try {
        await this.sleep(index * 200 * Math.random());
        let response = await axios.post(
          `${process.env.ES_HOST}/${process.env.ES_INDEX}/${
            process.env.ES_TYPE
          }`,
          item,
        );
        this.logger.info('Exported ' + index + ' to Elastic Search.');
      } catch (err) {
        this.logger.info('Error exporting ' + index + ' to Elastic Search.');
        this.logger.error(err);
      }
    });
  }
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
