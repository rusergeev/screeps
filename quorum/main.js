'use strict'

if (Game.cpu.bucket < 500) {
  throw new Error('Extremely low bucket - aborting script run at top level')
}

// Load any prototypes or libraries

/* Get Upload Version */
require('version')
require('constants')

/* Enable QOS Logger */
const QosLogger = require('qos/logger')
global.Logger = new QosLogger()

/* Add "sos library" - https://github.com/ScreepsOS/sos-library */
global.SOS_LIB_PREFIX = 'thirdparty_'
global.sos_lib = require('thirdparty_sos_lib')

/* Add additional room visualizations - https://github.com/screepers/RoomVisual */
require('thirdparty_roomvisual')

/* Add "creep talk" library - https://github.com/screepers/creeptalk */
const language = require('thirdparty_creeptalk_emoji')
require('thirdparty_creeptalk')({
  'public': true,
  'language': language
})

/* Make the quorum library code available globally */
global.qlib = require('lib/loader')

/* Extend built in objects */
require('extends/controller')
require('extends/creep')
require('extends/creep/actions')
require('extends/creep/movement')
require('extends/creep/overrides')
require('extends/lab')
require('extends/mineral')
require('extends/observer')
require('extends/room/alchemy')
require('extends/room/conflict')
require('extends/room/construction')
require('extends/room/control')
require('extends/room/economy')
require('extends/room/intel')
require('extends/room/logistics')
require('extends/room/landmarks')
require('extends/room/meta')
require('extends/room/movement')
require('extends/room/spawning')
require('extends/room/structures')
require('extends/room/territory')
require('extends/roomposition')
require('extends/terminal')
require('extends/source')
require('extends/storage')

const QosKernel = require('qos_kernel')

module.exports.loop = function () {
  if (Game.cpu.bucket < 500) {
    if (Game.cpu.limit !== 0) {
      Logger.log('Extremely low bucket - aborting script run at start of loop', LOG_FATAL)
    }
    return
  }
  const kernel = new QosKernel()
  kernel.start()
  global.Empire = new qlib.Empire()
  kernel.run()
  kernel.shutdown()
}
