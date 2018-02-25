let time_to_path = function (){
    p * Math.ceil((c + w) / m) + r * Math.ceil((c + w) / 2 / m) + s * Math.ceil((c + w) * 5 / m);
}
console.log('time ' + Game.time);

var roi_opt = 0;
var spawn_opt;
var source_opt;
var c_opt = 0;
var m_opt = 0;
var w_opt = 0;
var path_opt;
var cost_opt;
var t_opt;
var income_opt;
var t_carry_opt;
var loss_opt;
var gross_opt;
var net_opt;

let spawns = Game.spawns;
for(let name in spawns) {
    let spawn = spawns[name];

    let rooms = Game.rooms;
    for (let name in rooms) {

        let room = rooms[name];
        let sources = room.sources;

        let energy = room.energyCapacityAvailable;
        console.log(room + ' energy ' + energy);

        let source_energy = 3000;

        const c_min = 0;
        const m_min = 1;
        const w_min = 1;

        for (let name in sources) {
            let source = sources[name];
            const c_max = 0;
            const w_max = Math.ceil(source.energyCapacity / 300);
            const m_max = (c_max + w_max) * 5;

            let path = spawn.pos.findPathTo(source, {ignoreCreeps:true});
            path.shift();
            path.pop();
            let p = 0;
            let r = 0;
            let s = 0;
            //console.log(JSON.stringify(path));
            for (let name in path) {
                let pos = path[name];
                let road = room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y).filter( s => s.structureType === STRUCTURE_ROAD).length;
                if(road > 0){
                    r++;
                } else {
                    let terrain = room.lookForAt(LOOK_TERRAIN, pos.x, pos.y);
                    if (terrain[0] === 'swamp') s++;
                    else p++;
                }
            }

            for (let c = c_min; c <= Math.min(c_max, (energy - 50 * m_min - 100 * w_min ) / 50); c++) {
                for (let m = m_min; m <= Math.min(m_max, (energy - 50 * c - 100 * w_min ) / 50); m++) {
                    for (let w = w_min; w <= Math.min(w_max, (energy - 50 * c - 50 * m ) / 100); w++) {
                        let cost = 50 * c + 50 * m + 100 * w;
                        let t_carry = p * Math.ceil((c + w) / m) + r * Math.ceil((c + w) / 2 / m) + s * Math.ceil((c + w) * 5 / m);
                        let t = p * Math.ceil(1.0 * w / m) + r * Math.ceil(w / 2.0 / m) + s * Math.ceil(w * 5.0 / m);
                        let t_build = c + m + w;
                        let income = 1500 * Math.min(2 * w, source_energy / 300);
                        let loss = t * 2 * w;
                        let gross = income - loss;
                        let net = gross - cost;
                        let roi = net / (t + t_build + 1500);
                        if (roi > roi_opt && roi > 1) {

                            roi_opt = roi;
                            c_opt = c;
                            m_opt = m;
                            w_opt = w;
                            spawn_opt = spawn;
                            source_opt = source;
                            path_opt = path;

                            cost_opt = cost;
                            t_opt = t;
                            t_carry_opt = t_carry;
                            income_opt = income;
                            loss_opt = loss;
                            gross_opt = gross;
                            net_opt = net;
                            roi_opt = roi;
                        }
                    }
                }
            }
        }
        console.log(spawn
            + ' ' + source_opt
            + 'opt config : CARRYx' + c_opt + ' MOVEx' + m_opt + ' WORKx' + w_opt
            + ' = cost :' + cost_opt
            + ' time : ' + t_opt + '( ' + t_carry_opt + ' )'
            + ' income :' + income_opt
            + ' loss :' + loss_opt
            + ' gross :' + gross_opt
            + ' net :' + net_opt
            + ' ROI :' + roi_opt);
    }
}


return;