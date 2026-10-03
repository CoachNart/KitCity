import { STDATA, hornOf, skyFor, skyNow, transTo, transAlpha } from './stateData.js';

export function mountKitCityGame(THREE) {
'use strict';
        let dead = false;
        const $ = id => document.getElementById(id);
        const isTouch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
        document.body.classList.toggle('touch', isTouch);

        $('start-list').innerHTML = isTouch
            ? '<li><b>Swipe left or right once</b> anywhere on the screen. Your danfo glides into the next lane by itself. Use your other thumb for the pedals.</li>' +
              '<li><b>GAS</b> to go, <b>BRAKE</b> to stop, <b>REVERSE</b> to back up.</li>' +
              '<li><b>📯</b> is your horn. <b>📷</b> switches camera. <b>↺</b> puts you back on the road.</li>' +
              '<li>Follow the <b>yellow arrow</b> and the <b>light beam</b>. Pull into the curb lane, slow down, then tap <b>PICK UP</b>.</li>' +
              '<li>Drive through the <b>$KIT</b> coins to earn. Watch out for pedestrians, hawkers and truck pushers.</li>' +
              '<li>Landscape mode works best.</li>'
            : '<li><b>W A S D</b> or arrow keys to drive. <b>S</b> brakes. <b>V</b> reverses. <b>Space</b> is the handbrake.</li>' +
              '<li><b>H</b> horn, <b>C</b> camera, <b>R</b> back on road, <b>M</b> mute.</li>' +
              '<li>Follow the <b>yellow arrow</b> and the <b>light beam</b>. Pull into the curb lane, slow down, then press <b>E</b> to pick up.</li>' +
              '<li>Drive through the <b>$KIT</b> coins to earn. Watch out for pedestrians, hawkers and truck pushers.</li>';

        if (typeof THREE === 'undefined') {
            $('start-sub').textContent = 'Could not load the 3D engine. Check your internet connection and reload the page.';
            $('btn-start').style.display = 'none';
            return;
        }

        // ============================================================
        // 1. CONSTANTS & DATA
        // ============================================================
        const ROAD_HALF = 17;
        const START_Z = 40;
        const END_Z = -6500;
        const TERMINAL_Z = -6450;
        const ZONE_X = 14.5;
        const ZONE_R = 9;
        const STOPS = [-520, -1320, -2120, -2920, -3720];
        const MAX_V = 42; // m/s, about 150 km/h

        const PASSENGERS = [
            {
                name: 'Tunde', role: 'University Student', stop: 'Computer Village',
                shirt: 0x2980b9, skin: 0x4a3525,
                line: '"Omo driver, I don tire for crypto! Someone promised me ₦500k giveaway yesterday, but my wallet got drained completely. Web3 na pure scam!"',
                options: [
                    { text: 'Sorry about that! A giveaway that asks for your seed phrase or a wallet connection is phishing, not Web3. Real Web3 means you hold your own keys.', correct: true },
                    { text: 'Ah, crypto is pure luck my brother! Just buy the next coin and hope you get rich.', feedback: 'Crypto is not a lottery. Treating it like gambling is exactly how people lose money.' },
                    { text: 'E don happen! Next time just click the link again and approve everything quick quick.', feedback: 'Approving unknown links and transactions is how wallets get drained in the first place.' }
                ],
                thanks: '"Wow, I didn\'t know the difference between phishing links and real self-custody! Thank you driver. I\'m ready to learn properly through T3Kit!"',
                tip: 'Never connect your wallet to a site you reached from a random giveaway message.'
            },
            {
                name: 'Mama Ngozi', role: 'Market Trader', stop: 'Allen Avenue',
                shirt: 0xc0392b, skin: 0x5a3a28,
                line: '"Driver, my neighbour showed me one app wey go double my money in 7 days. Dem say na Web3. I wan put my shop money inside."',
                options: [
                    { text: 'Mama, anybody who guarantees to double your money is a red flag. Real investments carry risk. Keep your shop money safe and check who is behind it.', correct: true },
                    { text: 'Try am sharp sharp before the offer finish!', feedback: 'Pressure to hurry and guaranteed returns are classic signs of a Ponzi scheme.' },
                    { text: 'As long as dem show plenty screenshots of profit, e must be legit.', feedback: 'Screenshots are very easy to fake. They prove nothing.' }
                ],
                thanks: '"Ah! Thank you o. I go keep my shop money and first learn how this thing really works."',
                tip: 'Only use money you can afford to lose, and be suspicious of guaranteed profits.'
            },
            {
                name: 'Chidi', role: 'Fresh Wallet Owner', stop: 'Ikeja Along',
                shirt: 0x27ae60, skin: 0x6b4630,
                line: '"Bros, I just opened a wallet. One \'support agent\' for Telegram say make I send my 12 words so dem fit verify am."',
                options: [
                    { text: 'Never send those 12 words to anyone. Real support will never ask for them. Write them on paper and keep them offline.', correct: true },
                    { text: 'Send am, support people dey help!', feedback: 'Anyone with your seed phrase can empty your wallet. Support never needs it.' },
                    { text: 'Take a screenshot and keep it in your phone gallery, e safe there.', feedback: 'Screenshots can be synced, hacked or leaked. Keep seed phrases offline.' }
                ],
                thanks: '"Chai! You just save me! I don block that fake agent. I go learn wallet safety on T3Kit."',
                tip: 'Your seed phrase is the master key. Nobody legitimate will ever ask for it.'
            },
            {
                name: 'Aisha', role: 'Fresh Graduate', stop: 'Mende',
                shirt: 0x8e44ad, skin: 0x4e3322,
                line: '"I graduated last year, still no job. I hear say Web3 get opportunities, but I no know where to start."',
                options: [
                    { text: 'Start with the basics: wallets, blockchain and staying safe. Then build small projects and join a community. T3Kit gives you a guided path.', correct: true },
                    { text: 'Buy one expensive guru course that guarantees you $5,000 a month.', feedback: 'Guaranteed income claims are a warning sign. Skills and projects matter more than hype.' },
                    { text: 'Just learn to read trading charts, that is the only skill you need.', feedback: 'Trading is not the same as building skills. Web3 needs developers, designers, writers and community builders too.' }
                ],
                thanks: '"This is exactly what I needed, a clear starting point. Abeg, how do I join T3Kit?"',
                tip: 'Learn the basics first, build in public, and join learning communities.'
            },
            {
                name: 'Mr. Bola', role: 'Banker', stop: 'Anthony',
                shirt: 0x34495e, skin: 0x3d2a1c,
                line: '"Abeg, crypto na only for yahoo boys. Banks and real business no dey use am."',
                options: [
                    { text: 'Some people misuse it, like any tool. But blockchain is also used for cross-border payments, stablecoins and digital ownership. The key is to verify and stay safe.', correct: true },
                    { text: 'You are right sir, all crypto na scam, no need to learn anything.', feedback: 'Writing off a whole technology means you also miss how to spot the scams that do exist.' },
                    { text: 'Every coin go 100x. Na bank wey no wan make you know.', feedback: 'No coin is guaranteed to 100x. Hype is not a reason to ignore risk.' }
                ],
                thanks: '"Hmm, fair point. Maybe I should understand it before I judge it. Let me look at T3Kit."',
                tip: 'Be curious but careful: understand a technology before dismissing or hyping it.'
            }
        ];

        // ============================================================
        // 1b. NIGERIA: all 36 states + FCT (pick your state on the start screen)
        // ============================================================
        const ZONES = {
            SW: { label: 'South West', greet: 'Bawo ni, driver!', names: ['Kunle', 'Mama Sade', 'Femi', 'Funke', 'Mr. Adeyemi'], ground: 0x7d8f5b, sky: 0x87ceeb, fog: 0x9fd3ec, bld: null, hawk: null },
            SE: { label: 'South East', greet: 'Kedu, driver!', names: ['Chinedu', 'Mama Ngozi', 'Obinna', 'Chioma', 'Mr. Emeka'], ground: 0x6f9455, sky: 0x87ceeb, fog: 0x9fd3ec, bld: null, hawk: [null, null, 'Boli! Hot boli!', null] },
            SS: { label: 'South South', greet: 'How far, driver!', names: ['Etim', 'Mama Blessing', 'Ovie', 'Ibiene', 'Mr. Okon'], ground: 0x5f8f4e, sky: 0x8fc7d9, fog: 0xa5d3df, bld: null, hawk: [null, null, 'Boli! Hot boli!', null] },
            NC: { label: 'North Central', greet: 'Good day, driver!', names: ['Terkimbi', 'Mama Ene', 'Danladi', 'Ladi', 'Mr. Audu'], ground: 0x8f9a5d, sky: 0x8ccbe8, fog: 0xa9d2e4, bld: [0xc9b79a, 0xb7bf9a, 0xc99a82, 0x9aa3b5, 0xd4ad7c, 0xe6d8b8], hawk: null },
            NW: { label: 'North West', greet: 'Sannu, driver!', names: ['Musa', 'Hajiya Amina', 'Sani', 'Zainab', 'Malam Ibrahim'], ground: 0xb3a374, sky: 0xa9c9dc, fog: 0xd6cdb4, bld: [0xd9c3a0, 0xcdb590, 0xe3d3b5, 0xbfa885, 0xd4b48a, 0xe8dcc3], hawk: [null, null, null, 'Kunu! Cold kunu!'] },
            NE: { label: 'North East', greet: 'Sannu, driver!', names: ['Bukar', 'Hajiya Falmata', 'Modu', 'Hauwa', 'Malam Umar'], ground: 0xb3a374, sky: 0xa9c9dc, fog: 0xd6cdb4, bld: [0xd9c3a0, 0xcdb590, 0xe3d3b5, 0xbfa885, 0xd4b48a, 0xe8dcc3], hawk: [null, null, null, 'Kunu! Cold kunu!'] }
        };
        // [state, hub city, zone, known local stops, terminal]
        const NG_LIST = [
            ['Lagos', 'Ikeja', 'SW', [], 'Maryland'],
            ['Ogun', 'Abeokuta', 'SW', ['Kuto', 'Panseke', 'Lafenwa', 'Olumo Rock'], ''],
            ['Oyo', 'Ibadan', 'SW', ['UI Gate', 'Mokola', 'Dugbe', 'Bodija', 'Challenge'], 'Iwo Road'],
            ['Ondo', 'Akure', 'SW', ['FUTA Gate', 'Alagbaka', 'Oba Adesida Road'], ''],
            ['Osun', 'Osogbo', 'SW', ['Olaiya Junction', 'Oja Oba'], ''],
            ['Ekiti', 'Ado-Ekiti', 'SW', ['Ajilosun', 'Basiri', 'Okesa'], ''],
            ['Abia', 'Aba', 'SE', ['Ariaria Market'], ''],
            ['Anambra', 'Awka', 'SE', ['Aroma Junction', 'UNIZIK Junction'], ''],
            ['Ebonyi', 'Abakaliki', 'SE', ['Abakpa'], ''],
            ['Enugu', 'Enugu', 'SE', ['Holy Ghost', 'Independence Layout', 'Okpara Square'], 'Ogbete'],
            ['Imo', 'Owerri', 'SE', ['Wetheral Road', 'Douglas Road', 'Relief Market'], ''],
            ['Akwa Ibom', 'Uyo', 'SS', ['Ibom Plaza'], ''],
            ['Bayelsa', 'Yenagoa', 'SS', ['Swali', 'Opolo', 'Kpansia'], ''],
            ['Cross River', 'Calabar', 'SS', ['Marian Market', 'Watt Market'], ''],
            ['Delta', 'Asaba', 'SS', ['Okpanam Road', 'Cable Point'], ''],
            ['Edo', 'Benin City', 'SS', ['Uselu', 'Ugbowo', 'New Benin Market'], 'Ring Road'],
            ['Rivers', 'Port Harcourt', 'SS', ['Rumuokoro', 'Rumuola', 'Trans-Amadi', 'Garrison'], 'Mile 1'],
            ['Benue', 'Makurdi', 'NC', ['Wurukum', 'High Level'], ''],
            ['FCT', 'Abuja', 'NC', ['Wuse Market', 'Jabi', 'Garki', 'Nyanya'], 'Utako'],
            ['Kogi', 'Lokoja', 'NC', ['Ganaja', 'Felele'], ''],
            ['Kwara', 'Ilorin', 'NC', ['Tanke', 'Ipata Market', 'Gaa Akanbi', 'Challenge'], ''],
            ['Nasarawa', 'Lafia', 'NC', ['Karu'], ''],
            ['Niger', 'Minna', 'NC', ['Bosso', 'Tunga', 'Kpakungu'], ''],
            ['Plateau', 'Jos', 'NC', ['Rayfield', 'Bukuru', 'Terminus Market'], ''],
            ['Jigawa', 'Dutse', 'NW', [], ''],
            ['Kaduna', 'Kaduna', 'NW', ['Kawo', 'Barnawa', 'Sabon Tasha', 'Ahmadu Bello Way'], ''],
            ['Kano', 'Kano', 'NW', ['Sabon Gari', 'Kurmi Market', 'Zoo Road', 'Fagge'], 'Bompai'],
            ['Katsina', 'Katsina', 'NW', ['Kofar Marusa'], ''],
            ['Kebbi', 'Birnin Kebbi', 'NW', [], ''],
            ['Sokoto', 'Sokoto', 'NW', [], ''],
            ['Zamfara', 'Gusau', 'NW', [], ''],
            ['Adamawa', 'Yola', 'NE', ['Jimeta Market'], ''],
            ['Bauchi', 'Bauchi', 'NE', [], ''],
            ['Borno', 'Maiduguri', 'NE', ['Monday Market', 'Gamboru Market', 'Baga Road'], ''],
            ['Gombe', 'Gombe', 'NE', ['Pantami', 'Tudun Wada'], ''],
            ['Taraba', 'Jalingo', 'NE', [], ''],
            ['Yobe', 'Damaturu', 'NE', [], '']
        ];
        const slugState = n => n.toLowerCase().replace(/[^a-z]+/g, '-');
        const NGS = (function () {
            const want = String(window.__kcNext || location.hash || '').replace('#', '').toLowerCase();
            const row = NG_LIST.find(r => slugState(r[0]) === want) || NG_LIST[0];
            const zone = ZONES[row[2]];
            const pool = ['Central Market', 'Motor Park', 'General Hospital', 'Government House', 'Stadium Roundabout'];
            const stops = row[3].slice();
            for (let i = 0; stops.length < 5; i++) stops.push(row[1] + ' ' + pool[i]);
            const isFCT = row[0] === 'FCT';
            return {
                id: slugState(row[0]), name: row[0], city: row[1], zoneKey: row[2], zone: zone,
                stops: stops.slice(0, 5), lagos: row[0] === 'Lagos',
                term: row[4] || (row[1] + ' Central'),
                label: isFCT ? 'FCT' : row[0] + ' State',
                sign: isFCT ? 'WELCOME TO THE FCT' : 'WELCOME TO ' + row[0].toUpperCase() + ' STATE'
            };
        })();
        const ZONE = NGS.zone;
        // ============================================================
        // 1c. STATE WORLDS: every state has its own look, people, traffic, weather and mission
        // ============================================================
        const SKY = {
            morning:  { top: 0x4e9be0, hor: 0xd6ecf7, fog: 0xc4e0ee, fd: 0.0040, sun: 0xfff4dc, si: 1.0,  sd: [45, 75, 45],   hs: [0xbfdfff, 0x6b5b45, 0.75] },
            noon:     { top: 0x2f86d6, hor: 0xbfe0f5, fog: 0xb5d8ee, fd: 0.0038, sun: 0xffffff, si: 1.15, sd: [10, 95, 15],   hs: [0xcfe6ff, 0x7a6a50, 0.70] },
            golden:   { top: 0x3a6fb5, hor: 0xffcf94, fog: 0xf0c9a0, fd: 0.0048, sun: 0xffc27a, si: 1.0,  sd: [-55, 38, -35], hs: [0xffe0b8, 0x6a4e3a, 0.65] },
            dusk:     { top: 0x2b2f6b, hor: 0xf08a5d, fog: 0xc98c78, fd: 0.0050, sun: 0xff9a62, si: 0.75, sd: [-60, 22, -40], hs: [0x9a8fd0, 0x4a3a3a, 0.60] },
            overcast: { top: 0x8da0ae, hor: 0xcfd8de, fog: 0xbac6cd, fd: 0.0046, sun: 0xe8eef2, si: 0.55, sd: [20, 80, 20],   hs: [0xc5d0d8, 0x6a6a60, 0.95] },
            storm:    { top: 0x3b4650, hor: 0x8fa0aa, fog: 0x7f8e98, fd: 0.0075, sun: 0xc8d3da, si: 0.35, sd: [20, 70, 20],   hs: [0x9fb0bb, 0x4f524f, 0.90] },
            haze:     { top: 0xb9b29a, hor: 0xe3d7b8, fog: 0xd9ccaa, fd: 0.0085, sun: 0xfff0c2, si: 0.85, sd: [30, 60, 30],   hs: [0xe8dcbc, 0x8a7a5a, 0.85] },
            dawn:     { top: 0x5b6fb0, hor: 0xffd9b0, fog: 0xe9cdb8, fd: 0.0060, sun: 0xffd2a0, si: 0.80, sd: [-40, 25, -30], hs: [0xd8c8e8, 0x5a4a4a, 0.70] },
            mist:     { top: 0x9fb8c4, hor: 0xe2ecef, fog: 0xdfe9ec, fd: 0.0095, sun: 0xf4f7f6, si: 0.60, sd: [20, 75, 20],   hs: [0xdde8ec, 0x5f6a60, 0.90] },
            sand:     { top: 0x6fa6d8, hor: 0xf2e6c8, fog: 0xeadcb8, fd: 0.0058, sun: 0xfff1cc, si: 1.25, sd: [10, 95, 10],   hs: [0xf3e8cc, 0x9a8458, 0.80] }
        };

        // People outfits per culture. m = men, f = women. Colours are hex.
        const KITS = {
            yo: { sk: [0x4a3020, 0x5a3a28, 0x6b4630], m: { robe: [0xf1ecde, 0x5b8fd6, 0x7fb88a, 0xd9b45a, 0xe8dcc5], cap: 'fila', capC: [0xb02a2a, 0x2c3e50, 0xd9b45a, 0x145a32], shirt: [0xf1ecde, 0x3b7dd8, 0x2e8b57], pants: [0x34495e, 0x4a3b2a] }, f: { top: [0xf4d03f, 0xe84393, 0xecf0f1, 0x1abc9c], wrap: [0xc0392b, 0x16a085, 0xd68910, 0x8e44ad, 0x2471a3], tie: 'gele', tieC: [0xf1c40f, 0xe84393, 0x00cec9, 0xff7675, 0x9b59b6] } },
            ig: { sk: [0x4a3525, 0x5a3a28, 0x6b4630], m: { shirt: [0xecf0f1, 0x1c1c1c, 0xc0392b, 0x2c6fbb], pants: [0x1d1d1d, 0x34495e, 0xd9d0b8], cap: 'red', capC: [0xb71c1c, 0xb71c1c, 0x111111] }, f: { top: [0xf5f5f5, 0xf1c40f, 0xe67e22], wrap: [0xc0392b, 0x2471a3, 0x16a085, 0xf39c12], tie: 'gele', tieC: [0xe84393, 0xf1c40f, 0x2ecc71] } },
            ha: { sk: [0x5a3a28, 0x6b4630, 0x7b5236], m: { robe: [0xf3efe6, 0x9ac5e8, 0x7ab87e, 0xc9b28a, 0x6e7ea8, 0xe0d4b0], cap: 'kufi', capC: [0xf5f5f5, 0x2c3e50, 0xb5651d, 0x1f6f54] }, f: { hijab: [0x2c3e50, 0x8e44ad, 0x16a085, 0xc0392b, 0xe67e22, 0x2980b9], top: [0x2c3e50, 0x8e44ad, 0x16a085, 0xc0392b] } },
            fu: { sk: [0x7b5236, 0x8a5d3a, 0x946a44], m: { robe: [0xd9c8a0, 0x8a6a3a, 0x5a6b4a], cap: 'fulani', capC: [0xd8b86a, 0xc8a45a] }, f: { top: [0xc0392b, 0x2c3e50, 0xe67e22], wrap: [0x2c3e50, 0xc0392b, 0x16a085], tie: 'scarf', tieC: [0xf1c40f, 0xe84393] } },
            kn: { sk: [0x4a3020, 0x5a3a28, 0x6b4630], m: { robe: [0xf3efe6, 0x3a5f9a, 0xe0d4b0], cap: 'turban', capC: [0xf3efe6, 0x1f3a64, 0xd4c9a8] }, f: { hijab: [0x1f3a64, 0x6a3d8f, 0xb3541e, 0x2d7a6a], top: [0x1f3a64, 0x6a3d8f, 0xb3541e] } },
            id: { sk: [0x3d2a1c, 0x4a3020, 0x5a3a28], m: { shirt: [0xecf0f1, 0x1f4e79, 0xd35400, 0x2e8b57], pants: [0xd9d0b8, 0x34495e], cap: 'red', capC: [0xd8c58a, 0x1f4e79] }, f: { top: [0xecf0f1, 0xf1c40f], wrap: [0x1f77b4, 0xe67e22, 0xe84393, 0x2ecc71], tie: 'scarf', tieC: [0xf1c40f, 0x00cec9] } },
            ef: { sk: [0x4e3322, 0x5a3a28, 0x6b4630], m: { robe: [0xf5f5f5, 0xc0392b, 0x1f4e79], cap: 'red', capC: [0xb71c1c, 0x111111] }, f: { top: [0xe84393, 0x2471a3, 0xf1c40f, 0x16a085], wrap: [0xe84393, 0x2471a3, 0xf1c40f, 0x16a085], tie: 'gele', tieC: [0xe84393, 0xf1c40f, 0x2ecc71], beads: 0xc0392b } },
            ed: { sk: [0x4a3020, 0x5a3a28, 0x6b4630], m: { shirt: [0xf4f1e6, 0xc0392b], pants: [0xf4f1e6, 0xc0392b], beads: 0xc0392b, cap: 'red', capC: [0xb71c1c] }, f: { top: [0xf4f1e6, 0xc0392b], wrap: [0xf4f1e6, 0xc0392b, 0x2c3e50], tie: 'gele', tieC: [0xc0392b, 0xf4f1e6], beads: 0xc0392b } },
            ti: { sk: [0x3d2a1c, 0x4a3020, 0x5a3a28], m: { shirt: [0x111111, 0xf1f1f1, 0x2c3e50], pants: [0x1d1d1d, 0xf1f1f1], cap: 'none' }, f: { top: [0x111111, 0xf1f1f1], wrap: [0x111111, 0xf1f1f1, 0xc0392b], tie: 'scarf', tieC: [0x111111, 0xf1f1f1] } },
            nu: { sk: [0x4a3020, 0x5a3a28, 0x6b4630], m: { robe: [0x5b7a9c, 0xd9c8a0, 0x6e8f5a], cap: 'kufi', capC: [0xf5f5f5, 0x2c3e50] }, f: { hijab: [0x5b7a9c, 0x6e8f5a, 0xb3541e, 0xe67e22], top: [0x5b7a9c, 0x6e8f5a] } },
            jo: { sk: [0x4a3020, 0x5a3a28, 0x6b4630], m: { shirt: [0x3b6ea5, 0x7a3b2e, 0x2f4f4f, 0xb33939], pants: [0x2f3b4a, 0x4a3b2a], cap: 'beanie', capC: [0xb33939, 0x2e8b57, 0x3b6ea5, 0xf1c40f] }, f: { top: [0xb33939, 0x2e8b57, 0x3b6ea5], wrap: [0x2f3b4a, 0x4a3b2a, 0x7a3b2e], tie: 'beanie', tieC: [0xb33939, 0xf1c40f] } },
            ur: { sk: [0x4a3020, 0x5a3a28, 0x6b4630, 0x7b5236], m: { shirt: [0xecf0f1, 0x6fa8dc, 0xb0b8c4, 0x2c3e50], pants: [0x1f2a38, 0x34495e], cap: 'none' }, f: { top: [0xffffff, 0xe8a0a0, 0x6fa8dc], wrap: [0x1f2a38, 0x7f8c8d, 0x34495e], tie: 'none' } },
            fi: { sk: [0x3d2a1c, 0x4a3020, 0x5a3a28], m: { shirt: [0x3b6e8a, 0xb0a070, 0xecf0f1], pants: [0x6b5b3a, 0x34495e], cap: 'red', capC: [0xd8c58a, 0xb0a070] }, f: { top: [0x3b6e8a, 0xecf0f1], wrap: [0x2471a3, 0xc0392b, 0x16a085], tie: 'scarf', tieC: [0xf1c40f, 0xe84393] } }
        };

        const TOPICS = {
            phish: ['That giveaway was phishing. Real giveaways never ask you to connect your wallet or share a seed phrase. Hold your own keys and check the official account.', 'Click the link again and approve everything quickly before the offer ends.', 'Approving unknown links and transactions is exactly how wallets get drained.', 'Crypto is pure luck. Just buy any coin and hope.', 'Crypto is not a lottery, and treating it like one is how people lose money.', '"So the link was the trap, not Web3 itself. Now I understand self-custody. Thank you, driver!"', 'Never connect your wallet to a site you reached from a random giveaway message.'],
            ponzi: ['Anybody who guarantees to double your {c} money is a red flag. Real investments carry risk. Keep your money safe and check who is behind it.', 'Try it quickly before the offer finishes, you can only gain.', 'Pressure to hurry and guaranteed returns are classic signs of a Ponzi scheme.', 'If they show plenty screenshots of profit, it must be legit.', 'Screenshots are very easy to fake. They prove nothing.', '"Ah! Thank you o. I will keep my money and first learn how this thing really works."', 'Only use money you can afford to lose, and distrust guaranteed profit.'],
            seed: ['Never send those 12 words to anyone. Real support will never ask for them. Write them on paper and keep them offline.', 'Send them, support people are there to help.', 'Anyone with your seed phrase can empty your wallet. Support never needs it.', 'Take a screenshot and keep it in your phone gallery, it is safe there.', 'Screenshots can sync to the cloud, get hacked or leak. Keep seed phrases offline.', '"Chai! You just saved me. I will block that fake agent and learn wallet safety on T3Kit."', 'Your seed phrase is the master key. Nobody legitimate will ever ask for it.'],
            rug: ['Check the team, the contract and whether liquidity is locked. If influencers shout 100x with no real product, walk away.', 'Buy now, the influencers cannot all be wrong.', 'Hype from paid influencers is not research, and rug pulls often start exactly like this.', 'Put in everything so you do not miss the pump.', 'Never put in more than you can afford to lose. Projects can vanish overnight.', '"Okay, I will research the team and the contract before I put in a kobo. Thanks!"', 'Hype is not research. Check the team, the code and the liquidity first.'],
            p2p: ['Never release crypto until the money shows in your own bank app. Fake alerts and screenshots are common in {c} deals.', 'Release it, the buyer sent a screenshot of the transfer.', 'A screenshot is not a payment. Only a real credit in your own bank app counts.', 'Release first so the buyer trusts you, then wait for the money.', 'Once crypto is released it cannot be called back. Confirm payment first.', '"That is exactly what almost happened to me. I will always check my own bank app first."', 'Confirm money in your own account before releasing crypto, always.'],
            xfer: ['Match the network and double-check the address, then send a small test first. Use well-known apps for sending money.', 'Just paste any address and send, the network does not matter.', 'Sending on the wrong network can lose funds for good.', 'Send everything at once to save on fees.', 'A small test transfer costs little and can save the whole amount.', '"A small test first. I like that. Now I can receive money from abroad with less fear!"', 'Same network, correct address, small test first.'],
            backup: ['Write the recovery phrase on paper, keep two copies in safe separate places, and never store it in photos, chats or the cloud.', 'Keep it in a WhatsApp note to yourself so you never lose it.', 'Chats and cloud notes can be hacked or shared by mistake.', 'Memorise it only, no need for a backup.', 'Memory fails and phones get lost. Use a proper offline backup.', '"Paper and two safe places. Simple! I will do it today, thank you."', 'Offline backup, two copies, separate places.'],
            career: ['Start with the basics: wallets, blockchain and staying safe. Then build small projects and join a community. T3Kit gives you a guided path.', 'Buy one expensive guru course that guarantees a huge monthly salary.', 'Guaranteed income claims are a warning sign. Skills and projects matter more than hype.', 'Learn to read trading charts, it is the only skill you need.', 'Trading is not the same as building skills. Web3 also needs developers, designers, writers and community builders.', '"This is the clear starting point I needed. How do I join T3Kit?"', 'Learn the basics first, build in public and join learning communities.'],
            art: ['Mint on a reputable platform, keep your original files, and never pay verification fees to strangers. Your {c} work is worth protecting.', 'Pay the verification fee the stranger asked for, so your work can be listed.', 'Real marketplaces do not ask strangers to collect a verification fee by transfer.', 'Post your best files on a free site and hope nobody copies them.', 'Anything you upload can be copied. Keep originals safe and prove ownership properly.', '"Now I know how to protect my {c} work and sell it safely. Thank you!"', 'Keep originals, use reputable platforms and never pay strangers to unlock a sale.'],
            records: ['Blockchain can make records harder to change, but the data you put in must be honest. Start small and keep official paper records too. {c} records need both.', 'Put everything on the blockchain and throw away the paper records.', 'Bad data on a blockchain is still bad data, and paper backups still matter.', 'Blockchain makes any record true automatically.', 'It only protects records from being changed later, not from being wrong in the first place.', '"So it protects honest records, it does not create them. That makes sense. Thank you!"', 'Blockchains keep records tamper-resistant, not automatically true.'],
            coop: ['Treat any digital ajo or esusu like real money. See the rules, who controls the keys, and avoid anyone collecting funds in a personal wallet.', 'Send your contribution to the organiser personal wallet, he is a good man.', 'A personal wallet collecting everyone money is a single point of failure, and a common scam.', 'Put your whole savings in so you get the biggest payout.', 'Never put in more than you can afford to lose, even with friends.', '"We will insist on written rules and shared control before anyone sends a kobo. Thank you!"', 'Clear rules, shared control, and small amounts to start.'],
            romance: ['Never send money to someone you only met online, however kind they sound. Verify who they are and report the account.', 'Send a small amount first to show you trust them.', 'That small amount is only the start. Scammers always ask for more.', 'Keep it a secret so family does not spoil the deal.', 'Secrecy is how scammers isolate people. Talk to someone you trust.', '"Chai, that was a scam all along. Thank you for opening my eyes, driver."', 'Strangers online who ask for money are scammers until proven otherwise.'],
            apk: ['Install wallets only from the official app store or the project verified website. Never install APK files sent in chats.', 'Download the APK from the chat link, it is faster.', 'Fake wallet apps steal your keys the moment you open them.', 'Any app with a similar name and logo is fine.', 'Scam apps copy names and logos exactly. Check the publisher and the official site.', '"I will delete that file and install only from the official store. Thank you!"', 'Official store or verified site only, never APKs from chats.'],
            otp: ['No real airdrop or support needs your OTP, BVN or bank PIN. Never share them. They open your bank account, not a prize.', 'Share the OTP so they can verify you quickly.', 'OTPs and PINs are the keys to your bank. Sharing them hands over your money.', 'Give your BVN but keep the OTP.', 'Your BVN with a few other details is already enough for fraud. Do not give it to unknown people.', '"That is the third time they called me. I will block the number now. Thank you!"', 'Never share OTPs, PINs or BVN with anyone who contacts you first.'],
            cloudmine: ['Be careful. Cloud mining and staking offers that promise fixed daily profit are usually scams. Check who runs it and never trust fixed returns.', 'Join fast, daily profit is guaranteed and the first withdrawal is free.', 'Guaranteed daily profit with an easy first withdrawal is how these scams earn trust.', 'Invite your friends so you earn more.', 'Recruiting others for rewards is the shape of a pyramid scheme.', '"Good that I asked. I will not join, and I will warn my friends. Thank you!"', 'Fixed daily returns plus recruiting rewards equals scam.'],
            approve: ['Check what you are approving. Unlimited token approvals let a bad contract empty your wallet, so revoke old approvals and sign only what you understand.', 'Click approve on everything so the site works smoothly.', 'An unlimited approval to a bad contract can drain your tokens later, even while you sleep.', 'Approvals are harmless, only sending is dangerous.', 'Approvals can be just as dangerous as sending. Review them carefully.', '"I did not know approvals could be dangerous. I will check and revoke today. Thank you!"', 'Read before you approve, and revoke old approvals.'],
            taskjob: ['A real job never asks you to pay to start, or to like videos for crypto first. Task scams pay small at first, then ask for a big deposit. Walk away.', 'Pay the small deposit, you will earn it back with the first tasks.', 'The first payouts are bait. The big deposit is what the scam is for.', 'Add more people to your task group to earn commission.', 'Commission for recruiting is a pyramid structure, not a job.', '"Phew! I nearly paid. I will look for real jobs through proper channels. Thank you!"', 'Real jobs do not charge you to start.'],
            meme: ['Treat meme coins as gambling money, not savings. Never use rent, school fees or business money, and set a limit before you start.', 'Borrow money and buy more, the next one will definitely pump.', 'Borrowing to chase a pump multiplies your losses when it falls.', 'Sell when it falls to get your money back sharp sharp.', 'Selling in panic locks the loss in, and chasing losses makes it worse. Decide your limit before you begin.', '"I will set a small limit and never touch the school fees again. Thank you!"', 'Only gamble what you can lose, never fees, rent or business money.'],
            skeptic: ['Some people misuse it, like any tool. But blockchain is also used for cross-border payments, stablecoins and digital ownership. The key is to verify and stay safe.', 'You are right sir, all crypto is a scam, no need to learn anything.', 'Writing off a whole technology means you also miss how to spot the scams that do exist.', 'Every coin will 100x. It is the banks that do not want you to know.', 'No coin is guaranteed to 100x. Hype is not a reason to ignore risk.', '"Hmm, fair point. Maybe I should understand it before I judge it. Let me look at T3Kit."', 'Be curious but careful: understand a technology before dismissing or hyping it.']
        };

        // ----- per-state worlds (v = look, m = mission, st = stops, p = passengers [name, role, topic, local noun, gender, story]) -----
        const STATES = {
            lagos: { term: 'Maryland',
                v: { sk: 'noon', gr: 0x6f8a58, rd: 'asphalt', rc: 0x2b2b30, sh: 'walk', shc: 0x9a9a95, bl: ['lowblock:4', 'highrise:3', 'market:1'], pal: [0xbfb09c, 0xa3b899, 0xc28282, 0x8e9aaf, 0xd4a373, 0xe6d8b8], tr: ['palm:2', 'shade:1'], far: 'lagoon', farc: 0x4a8fb5, lm: ['tower', 'bridgearch', 'tower', 'dome'], lmn: ['EKO ATLANTIC', 'THIRD MAINLAND BRIDGE', 'LEKKI SKYLINE', 'NATIONAL THEATRE'], veh: { danfo: 5, sedan: 3, bus: 1, keke: 1, truck: 1 }, vc: { danfo: [0xf5b014, 0x111111], bus: [0xd62828] }, tn: 13, kit: 'yo', amb: [1.3, 1.5, 1, 0], hawk: ['Pure water! Pure water!', 'Oranges! Sweet oranges!', 'Gala! Hot gala!', 'Cold zobo! Chapman!'] },
            },
            ogun: { st: ['Kuto', 'Panseke', 'Lafenwa', 'Sapon', 'Olumo Rock'], term: 'Olumo Rock',
                v: { sk: 'golden', gr: 0x7a8a50, gr2: 0x9a7a52, rd: 'asphalt', rc: 0x37322f, sh: 'dirt', shc: 0xa86a45, bl: ['colonial:3', 'compound:3', 'hillhouse:2'], pal: [0xe8d8b8, 0xd9a37a, 0xc8b898, 0xb8826a], tr: ['shade:3', 'palm:1', 'shrub:2'], far: 'rock', farc: 0x8a8070, lm: ['rock', 'hill', 'rock', 'tower'], lmn: ['OLUMO ROCK', 'ABEOKUTA HILLS', 'EGBA UPLANDS', 'CATHEDRAL TOWER'], veh: { danfo: 3, sedan: 3, keke: 3, okada: 2, truck: 1 }, vc: { danfo: [0xf5b014, 0x111111] }, tn: 11, kit: 'yo', amb: [0.8, 1, 1, 0], hawk: ['Pure water!', 'Oranges! Sweet oranges!', 'Roasted corn! Agbado!', 'Zobo! Cold zobo!'] },
                p: [['Kunle', 'Adire Dyer', 'phish', 'adire', 'm', 'Egba greetings, driver! Somebody posted a giveaway for adire sellers and my wallet was emptied after I connected it. Is Web3 just a trap for traders like me?'], ['Mama Sade', 'Cloth Seller', 'ponzi', 'cloth', 'f', 'Driver, a young man at Lafenwa says his app will double my cloth money in one week. He even showed me payment screenshots.'], ['Femi', 'Tour Guide', 'seed', 'tour', 'm', 'Bros, a stranger on Telegram says he can recover my lost wallet if I give him my 12 recovery words.'], ['Funke', 'Student', 'career', 'campus', 'f', 'I am finishing at the university and everyone talks about Web3 jobs. Where does a beginner even start?'], ['Mr. Adeyemi', 'Retired Teacher', 'skeptic', 'pension', 'm', 'Abeg, crypto na only for yahoo boys. Which serious business uses it?']] },
            oyo: { st: ['UI Gate', 'Mokola', 'Dugbe', 'Bodija', 'Challenge'], term: 'Iwo Road',
                v: { sk: 'dusk', gr: 0x7a7a4a, gr2: 0xa8693f, rd: 'asphalt', rc: 0x3a3532, sh: 'dirt', shc: 0xb06a42, bl: ['compound:6', 'colonial:2', 'market:1'], pal: [0xb87a55, 0xc9a07a, 0x9a7c60, 0xd0b898, 0xa56a4a], tr: ['shade:3', 'shrub:2'], far: 'hills', farc: 0x6a7a4a, lm: ['cocoa', 'hill', 'dome', 'tower'], lmn: ['COCOA HOUSE', 'IBADAN HILLS', 'MAPO HALL', 'DUGBE TOWER'], veh: { danfo: 3, sedan: 3, keke: 2, okada: 3, truck: 2 }, vc: { danfo: [0xf5b014, 0x111111] }, tn: 12, kit: 'yo', amb: [1, 1.2, 1, 0], hawk: ['Pure water!', 'Orange! Orange!', 'Gala! Sausage roll!', 'Zobo! Kunu!'] },
                p: [['Tunde', 'Student', 'phish', 'campus', 'm', 'Omo, I connected my wallet to a free giveaway link near UI and it drained everything. Web3 na scam!'], ['Alhaja Bisi', 'Textile Trader', 'ponzi', 'Dugbe', 'f', 'Driver, my customer says a digital cooperative will double my Dugbe money every month. Should I join?'], ['Tosin', 'Phone Repairer', 'apk', 'repair', 'm', 'A man sent me a wallet APK on WhatsApp saying it is the real app. Is it okay to install?'], ['Kemi', 'Nurse', 'otp', 'salary', 'f', 'Someone called saying I won an airdrop and asked for my OTP and BVN to confirm.'], ['Baba Gbenga', 'Retired Clerk', 'skeptic', 'pension', 'm', 'Who even uses crypto here in Ibadan? It is only for scammers.']] },
            ondo: { st: ['FUTA Gate', 'Alagbaka', 'Oba Adesida Road', 'Ijapo', 'Idanre Hills'], term: 'Idanre',
                v: { sk: 'morning', gr: 0x5c8a45, rd: 'asphalt', rc: 0x34312f, sh: 'grass', shc: 0x5f8f48, bl: ['colonial:2', 'timber:3', 'hillhouse:2', 'compound:2'], pal: [0xc8b898, 0xd9c8a0, 0xa8845e, 0xe0d4b8], tr: ['shade:4', 'palm:2', 'pine:0'], bk: ['shade:5', 'rock:2'], far: 'hills', farc: 0x4a6a3a, lm: ['hill', 'rock', 'hill', 'tower'], lmn: ['IDANRE HILLS', 'OWO ROCKS', 'AKURE RIDGE', 'FUTA TOWER'], veh: { danfo: 2, sedan: 3, keke: 3, okada: 3, truck: 2 }, vc: { danfo: [0xf5b014, 0x111111] }, tn: 10, kit: 'yo', amb: [0.7, 0.9, 1.2, 0], hawk: ['Pure water!', 'Oranges!', 'Plantain chips!', 'Zobo! Chapman!'] },
                p: [['Dare', 'Cocoa Farmer', 'ponzi', 'cocoa', 'm', 'Oga driver, a staking group says my cocoa money will double in seven days. I want to put in my harvest money.'], ['Mama Folake', 'Pepper Seller', 'seed', 'market', 'f', 'One support agent says he must hold my 12 words to fix my wallet. Is this normal?'], ['Seyi', 'FUTA Engineer', 'career', 'FUTA', 'm', 'I am an engineering graduate and I want a Web3 career. Where do I begin?'], ['Bukola', 'Teacher', 'p2p', 'school', 'f', 'A buyer paid me a screenshot for my USDT and wants me to release it now.'], ['Chief Ojo', 'Chief', 'records', 'land', 'm', 'Is it true blockchain can fix land records? Our family land is always in dispute.']] },
            osun: { st: ['Olaiya Junction', 'Oja Oba', 'Ogo Oluwa', 'Osun Grove Gate', 'Osogbo Art Hub'], term: 'Osun Grove',
                v: { sk: 'dawn', wx: 'mist', wxi: 0.5, gr: 0x4f8a45, gr2: 0x2f6a35, rd: 'asphalt', rc: 0x383533, sh: 'grass', shc: 0x56904a, bl: ['shrine:3', 'hut:2', 'compound:2', 'colonial:1'], pal: [0xe8d8b8, 0xc9a07a, 0xdcc9a0, 0xb9825a], tr: ['shade:5', 'shrub:3'], bk: ['shade:6', 'shrub:3'], far: 'hills', farc: 0x3f6a3a, lm: ['grove', 'tower', 'grove', 'dome'], lmn: ['OSUN SACRED GROVE', 'OSOGBO ART TOWER', 'GROVE OF OSUN', 'OSOGBO TEMPLE'], veh: { sedan: 3, keke: 4, okada: 3, danfo: 2, truck: 1 }, vc: { danfo: [0xf5b014, 0x111111] }, tn: 9, kit: 'yo', amb: [0.5, 0.8, 0.8, 0], hawk: ['Pure water!', 'Oranges!', 'Roasted plantain! Boli!', 'Zobo! Chapman!'] },
                p: [['Yemi', 'Sculptor', 'art', 'sculpture', 'f', 'I make sculptures and a stranger offered to list them as NFTs if I first pay a small verification fee.'], ['Babalawo Tayo', 'Herbalist', 'ponzi', 'herb', 'm', 'Driver, a young man says his staking pool will double my money by the next market day.'], ['Sola', 'Adire Artist', 'phish', 'adire', 'f', 'My friend lost his wallet after connecting to a link from a giveaway on Instagram.'], ['Bayo', 'Student', 'cloudmine', 'campus', 'm', 'Someone promised me daily profit from cloud mining if I just deposit a small amount.'], ['Mama Tope', 'Trader', 'xfer', 'Oja Oba', 'f', 'My son abroad wants to send money in crypto. How do I receive it safely?']] },
            ekiti: { st: ['Ajilosun', 'Basiri', 'Okesa', 'Ikere Junction', 'Ado Ridge'], term: 'Ado Hilltop',
                v: { sk: 'mist', wx: 'mist', wxi: 0.7, gr: 0x5f8a50, rd: 'asphalt', rc: 0x37352f, sh: 'grass', shc: 0x6a9a58, bl: ['hillhouse:4', 'tin:2', 'compound:2'], pal: [0xd9c8a0, 0xc8b898, 0xb89a78, 0xe8dcc0], tr: ['shade:3', 'shrub:3'], bk: ['rock:4', 'shade:4'], far: 'hills', farc: 0x5a7a52, lm: ['rock', 'hill', 'rock', 'tower'], lmn: ['IKERE ROCKS', 'EKITI UPLANDS', 'EFON RIDGE', 'ADO HILLTOP'], veh: { sedan: 3, keke: 3, okada: 3, danfo: 1, truck: 2 }, vc: {}, tn: 9, kit: 'yo', amb: [0.5, 0.7, 1.2, 0], hawk: ['Pure water!', 'Oranges!', 'Roasted yam!', 'Zobo!'] },
                p: [['Gbenga', 'Tomato Farmer', 'ponzi', 'harvest', 'm', 'Driver, my cooperative secretary says digital savings will double our harvest money. He wants it sent to his personal wallet.'], ['Ronke', 'Primary Teacher', 'coop', 'school', 'f', 'Our teachers want to run a digital ajo. How do we start safely?'], ['Tolu', 'Poly Student', 'rug', 'campus', 'm', 'Influencers say a new token will 100x. Should I put in my school fees?'], ['Mama Ibidun', 'Yam Seller', 'otp', 'yam', 'f', 'Someone called saying I won an airdrop and wants my OTP.'], ['Pa Akinola', 'Retired Pastor', 'skeptic', 'church', 'm', 'Crypto is for gamblers. Why should I care?']] },
            abia: { st: ['Ariaria Market', 'Osisioma', 'Faulks Road', 'Ngwa Road', 'Aba Power'], term: 'Aba Central',
                v: { sk: 'overcast', wx: 'rain', wxi: 0.35, gr: 0x6a8a52, rd: 'wet', rc: 0x2f3034, sh: 'walk', shc: 0x8d8d86, bl: ['market:5', 'lowblock:3', 'silo:1'], pal: [0xc8b8a0, 0xb8a888, 0xd0a878, 0x9aa0a8, 0xb85a4a, 0xd9c8a8], tr: ['shade:2', 'palm:1'], far: 'hills', farc: 0x5f7a5a, lm: ['tower', 'dome', 'tower', 'tank'], lmn: ['ARIARIA MARKET', 'ABA POWER', 'GEOMETRIC POWER', 'SHOE FACTORY'], veh: { keke: 5, truck: 3, sedan: 2, danfo: 2, okada: 2 }, vc: { keke: [0x1a7a3a], danfo: [0xf5b014, 0x111111] }, tn: 14, kit: 'ig', amb: [1.4, 1.7, 0.8, 0.6], hawk: ['Pure water!', 'Orange!', 'Boli! Hot boli!', 'Zobo! Cold drink!'] },
                p: [['Chinedu', 'Shoemaker', 'ponzi', 'shoe', 'm', 'Kedu, driver! A man in Aba says his app doubles shoe money every week. He even paid a small profit to my friend.'], ['Mama Nkechi', 'Provision Seller', 'seed', 'provision', 'f', 'My daughter says support wants her 12 words so they can fix her wallet.'], ['Obinna', 'Leather Worker', 'p2p', 'leather', 'm', 'A buyer sent a bank alert screenshot and wants me to release my USDT quickly.'], ['Ifeoma', 'Tailor', 'art', 'fashion', 'f', 'A stranger wants to mint my fashion designs and asks me to pay a verification fee.'], ['Mr. Emeka', 'Importer', 'xfer', 'import', 'm', 'I want to pay my China supplier with crypto. How do I avoid sending to the wrong address?']] },
            anambra: { st: ['Onitsha Main Market', 'Awka Aroma', 'Nnewi Junction', 'Upper Iweka', 'Niger Bridge Head'], term: 'Niger Bridge',
                v: { sk: 'golden', gr: 0x6a8f50, rd: 'asphalt', rc: 0x35353a, sh: 'walk', shc: 0x9a9a92, bl: ['market:4', 'lowblock:3', 'civic:1'], pal: [0xd0a878, 0xc8b8a0, 0xb88a6a, 0xe0d0b0, 0xa8b0b8], tr: ['shade:2', 'palm:1'], far: 'river', farc: 0x4f86a8, lm: ['bridgearch', 'tower', 'dome', 'tower'], lmn: ['NIGER BRIDGE', 'ONITSHA MAIN MARKET', 'AWKA CIVIC CENTRE', 'NNEWI TOWER'], veh: { keke: 4, danfo: 3, sedan: 3, truck: 2, bus: 1 }, vc: { danfo: [0xf5b014, 0x111111], keke: [0x2d8a3a], bus: [0x2f6dd0] }, tn: 14, kit: 'ig', amb: [1.3, 1.6, 1, 0], hawk: ['Pure water!', 'Oranges!', 'Boli and fish!', 'Zobo! Cold drink!'] },
                p: [['Ikenna', 'Market Trader', 'ponzi', 'Onitsha', 'm', 'Kedu, driver! A group says my Onitsha market profit will double if I send it to their wallet this week.'], ['Nneka', 'Ankara Seller', 'phish', 'Ankara', 'f', 'A giveaway page asked me to connect my wallet and now it is empty.'], ['Uche', 'Spare-Parts Dealer', 'cloudmine', 'Nnewi', 'm', 'A man promises fixed daily profit from cloud mining if I deposit my spare-parts money.'], ['Adaeze', 'Nurse', 'romance', 'ward', 'f', 'A man I met online says he is a doctor abroad and wants me to buy crypto for him.'], ['Dr. Okafor', 'Lecturer', 'records', 'student', 'm', 'Can blockchain help us keep student certificates safe from forgery?']] },
            ebonyi: { st: ['Abakpa', 'Rice Mill', 'Izzi Junction', 'Abakaliki Main Market', 'Ezzamgbo'], term: 'Abakaliki Central',
                v: { sk: 'haze', wxi: 0.3, gr: 0x9a9456, gr2: 0xb8a068, rd: 'laterite', rc: 0xa8603e, sh: 'dirt', shc: 0xb8703f, bl: ['compound:3', 'hut:3', 'silo:2', 'market:1'], pal: [0xc88a5a, 0xb87a50, 0xd0a070, 0xc8a888], tr: ['shade:2', 'shrub:3'], bk: ['shade:3', 'shrub:3'], fld: [0x6f9a3a, 0x8aa83e, 0x5c8a34, 0xa8a84a], far: 'hills', farc: 0x7a8a50, lm: ['tank', 'tower', 'hill', 'tank'], lmn: ['RICE MILL', 'ABAKALIKI TOWER', 'EZZA HILLS', 'RICE SILOS'], veh: { truck: 4, keke: 3, okada: 3, sedan: 2, danfo: 1 }, vc: { keke: [0xe0a020] }, tn: 10, kit: 'ig', amb: [0.7, 0.9, 1.1, 0], hawk: ['Pure water!', 'Oranges!', 'Fried rice and chicken!', 'Zobo!'] },
                p: [['Okechukwu', 'Rice Farmer', 'ponzi', 'rice', 'm', 'Driver, a cooperative group says my rice money will double through staking. They want me to send to one wallet.'], ['Mama Ugo', 'Rice Parboiler', 'coop', 'cooperative', 'f', 'Our women group wants to save digitally. How do we make it safe?'], ['Chika', 'Student', 'taskjob', 'campus', 'f', 'Someone offered me crypto for liking videos but asked me to deposit first.'], ['Nnamdi', 'Mill Operator', 'rug', 'mill', 'm', 'Influencers are shouting about a new coin that will 100x. I want to put in my salary.'], ['Elder Onu', 'Community Elder', 'records', 'farm', 'm', 'Can blockchain help us record farm ownership honestly?']] },
            enugu: { st: ['Holy Ghost', 'Ogbete Market', 'Independence Layout', 'Okpara Square', 'Coal Camp'], term: 'Coal Camp',
                v: { sk: 'overcast', gr: 0x58704a, gr2: 0x2a2a2a, rd: 'asphalt', rc: 0x2e2e30, sh: 'walk', shc: 0x8a8a84, bl: ['colonial:2', 'civic:2', 'hillhouse:2', 'lowblock:3'], pal: [0xd8d0c0, 0xc0b8a8, 0xb0a898, 0xe0d8c8, 0x9aa0a8], tr: ['shade:3', 'pine:1', 'shrub:2'], far: 'hills', farc: 0x4a5f4a, lm: ['hill', 'tower', 'dome', 'hill'], lmn: ['UDI HILLS', 'COAL CITY TOWER', 'OKPARA SQUARE', 'ENUGU ESCARPMENT'], veh: { sedan: 4, danfo: 2, keke: 3, okada: 1, bus: 1, truck: 2 }, vc: { danfo: [0xf5b014, 0x111111], bus: [0x2f6dd0] }, tn: 11, kit: 'ig', amb: [0.8, 0.9, 1.1, 0.2], hawk: ['Pure water!', 'Oranges!', 'Roasted corn and ube!', 'Zobo!'] },
                p: [['Ebuka', 'Civil Servant', 'phish', 'office', 'm', 'Kedu, driver! My colleague lost all his tokens after connecting to a giveaway link. Is Web3 safe at all?'], ['Mama Oge', 'Hair Stylist', 'ponzi', 'salon', 'f', 'My client says an app will double my salon money in a week.'], ['Kelechi', 'Miner', 'meme', 'mining', 'm', 'My friends are buying meme coins with their wages. Should I borrow to join them?'], ['Amara', 'Student', 'career', 'campus', 'f', 'I want a Web3 career. Where does a beginner start?'], ['Chief Nwosu', 'Contractor', 'skeptic', 'contract', 'm', 'Is crypto even real business, or just tricks?']] },
            imo: { st: ['Wetheral Road', 'Douglas Road', 'Relief Market', 'Egbu', 'Owerri Imo Hub'], term: 'Owerri Hub',
                v: { sk: 'dusk', gr: 0x58844a, rd: 'asphalt', rc: 0x2d2e35, sh: 'walk', shc: 0x8f8f95, med: 0x3a8a4a, bl: ['civic:3', 'lowblock:3', 'market:2', 'highrise:1'], pal: [0xe8d8c8, 0xd0a8b8, 0xb8c8d8, 0xe0c898, 0xc8d8b8], tr: ['palm:3', 'shade:1'], far: 'hills', farc: 0x4a6a4a, lm: ['tower', 'dome', 'tower', 'stadium'], lmn: ['OWERRI TOWER', 'IMO CIVIC CENTRE', 'WETHERAL SKYLINE', 'DAN ANYIAM STADIUM'], veh: { sedan: 5, keke: 3, danfo: 2, okada: 1, bus: 1 }, vc: { danfo: [0xf5b014, 0x111111], bus: [0xc62828] }, tn: 12, kit: 'ig', amb: [1.1, 1.5, 0.8, 0], hawk: ['Pure water!', 'Oranges!', 'Suya! Hot suya!', 'Chapman! Cold chapman!'] },
                p: [['Somto', 'Event Planner', 'ponzi', 'event', 'f', 'Kedu, driver! A guest says an investment app will double my event money by the weekend.'], ['Kingsley', 'DJ', 'rug', 'party', 'm', 'Influencers say a new token will definitely pump. My crew wants me to buy in.'], ['Nkiru', 'Fashion Designer', 'art', 'fashion', 'f', 'A buyer offered to mint my designs as NFTs if I pay a listing fee.'], ['Ugo', 'Bank Teller', 'otp', 'bank', 'm', 'A caller asked me to verify an airdrop with my OTP and BVN.'], ['Mama Ada', 'Caterer', 'seed', 'catering', 'f', 'Someone says he can double my wallet if I give him my 12 words.']] },
            'akwa-ibom': { st: ['Ibom Plaza', 'Itam Market', 'Ikot Ekpene Junction', 'Aka Road', 'Uyo Ibom Hub'], term: 'Ibom Hub',
                v: { sk: 'noon', gr: 0x4f8a3f, rd: 'concrete', rc: 0x3a3a3f, sh: 'walk', shc: 0xb8b8b0, med: 0x2f8a3a, bl: ['civic:5', 'lowblock:2', 'highrise:1'], pal: [0xf0eee6, 0xdad8cc, 0xe8e0d0, 0xc8d8dc], tr: ['palm:5', 'shade:1'], far: 'hills', farc: 0x3f7a45, lm: ['dome', 'tower', 'stadium', 'tower'], lmn: ['IBOM PLAZA', 'AKWA IBOM AIRPORT TOWER', 'GODSWILL AKPABIO STADIUM', 'IBOM SKYLINE'], veh: { sedan: 5, keke: 3, bus: 2, danfo: 1, okada: 1 }, vc: { bus: [0x1f77b4], keke: [0xe0a020] }, tn: 10, kit: 'ef', amb: [0.8, 0.9, 0.8, 0], hawk: ['Pure water!', 'Oranges!', 'Roasted plantain and fish!', 'Zobo!'] },
                p: [['Etim', 'Civil Servant', 'phish', 'office', 'm', 'How far, driver! My cousin connected his wallet to a free giveaway and lost everything. Is Web3 safe?'], ['Mama Blessing', 'Fish Seller', 'ponzi', 'fish', 'f', 'A woman at the market says an app will double my fish money.'], ['Ima', 'Student', 'taskjob', 'campus', 'f', 'A man offered me crypto to rate videos but wants a deposit first.'], ['Okon', 'Oil Worker', 'xfer', 'oil', 'm', 'My brother abroad wants to send me USDT. How do I receive it safely?'], ['Mr. Akpan', 'Teacher', 'backup', 'school', 'm', 'I just set up a wallet. How should I back up my recovery phrase?']] },
            bayelsa: { st: ['Swali', 'Opolo', 'Kpansia', 'Ox-bow Lake', 'Yenagoa Waterfront'], term: 'Waterfront',
                v: { sk: 'storm', wx: 'rain', wxi: 0.6, gr: 0x3f7a45, rd: 'wet', rc: 0x2b2e33, sh: 'water', shc: 0x8a6a45, bl: ['stilt:6', 'timber:2', 'dry:1'], pal: [0x8a6a45, 0x6a8a9a, 0xa08a60, 0x7a8a6a, 0xb8a078], tr: ['palm:3', 'mangrove:4'], bk: ['mangrove:5', 'palm:2'], far: 'river', farc: 0x3f6f88, lm: ['lighthouse', 'tank', 'bridgearch', 'tower'], lmn: ['YENAGOA LIGHTHOUSE', 'OIL TERMINAL', 'WATERFRONT BRIDGE', 'PEACE TOWER'], veh: { keke: 4, okada: 3, sedan: 3, truck: 2, bus: 1 }, vc: { keke: [0x1a7a3a], bus: [0x1f77b4] }, tn: 9, kit: 'ti', amb: [0.5, 0.8, 0.8, 1], hawk: ['Pure water!', 'Oranges!', 'Fresh fish! Roast fish!', 'Zobo!'] },
                p: [['Ebi', 'Fisherman', 'ponzi', 'fish', 'm', 'How far, driver! A group says my fish money doubles in seven days. They want it in one wallet.'], ['Mama Ibiene', 'Boat Seller', 'seed', 'canoe', 'f', 'A man called Mr Support says he needs my 12 words to unlock my wallet.'], ['Preye', 'Student', 'career', 'campus', 'm', 'Is there any real work in Web3 for people from the riverine areas?'], ['Tamara', 'Nurse', 'apk', 'clinic', 'f', 'Someone sent me an APK saying it is the official wallet.'], ['Chief Diete', 'Community Chief', 'records', 'land', 'm', 'Can the blockchain protect our community land records?']] },
            'cross-river': { st: ['Marian Market', 'Watt Market', 'Calabar Carnival Centre', 'Tinapa Road', 'Calabar Waterfront'], term: 'Carnival Centre',
                v: { sk: 'golden', wx: 'rain', wxi: 0.2, gr: 0x3f8a45, rd: 'brick', rc: 0xa8604a, sh: 'cobble', shc: 0x9a8a78, bl: ['colonial:4', 'timber:2', 'civic:1', 'market:1'], pal: [0xf0d8b8, 0xe8a0a0, 0xa8d0c8, 0xf0e0a0, 0xc8a0d8, 0x98c8e8], tr: ['palm:3', 'shade:3'], bk: ['shade:6', 'palm:3'], far: 'hills', farc: 0x3f7a4a, lm: ['dome', 'hill', 'tower', 'lighthouse'], lmn: ['CARNIVAL CENTRE', 'OBUDU RANGE', 'CALABAR MUSEUM', 'WATERFRONT LIGHT'], veh: { sedan: 3, keke: 4, danfo: 2, okada: 2, bus: 1 }, vc: { keke: [0xe0a020], bus: [0xd62828], danfo: [0xf5b014, 0x111111] }, tn: 10, kit: 'ef', amb: [0.7, 1.2, 0.8, 0.2], hawk: ['Pure water!', 'Oranges!', 'Roasted fish!', 'Zobo!'] },
                p: [['Edem', 'Drummer', 'rug', 'band', 'm', 'How far, driver! Influencers say a new token will 100x. My band wants to put in the carnival money.'], ['Mama Effiong', 'Costume Maker', 'art', 'costume', 'f', 'A buyer wants to mint my costume designs and asked me to pay a verification fee.'], ['Inyang', 'Tour Guide', 'romance', 'tour', 'm', 'A tourist I chatted with online says she will send me money if I buy crypto for her first.'], ['Ansa', 'Student', 'phish', 'campus', 'f', 'My friends lost money to a giveaway link. Is Web3 safe at all?'], ['Mr. Bassey', 'Hotel Manager', 'xfer', 'hotel', 'm', 'I want to receive tourist payments in USDT. How do I avoid mistakes?']] }
        };

        Object.assign(STATES, {
            delta: { st: ['Okpanam Road', 'Cable Point', 'Warri Effurun', 'Sapele Road', 'Asaba Niger Bridge'], term: 'Niger Bridge',
                v: { sk: 'haze', wxi: 0.3, gr: 0x5a7a48, rd: 'asphalt', rc: 0x2c2d31, sh: 'walk', shc: 0x8a8a84, bl: ['oil:4', 'lowblock:3', 'market:1', 'civic:1'], pal: [0xc8c0b0, 0xa8b0b8, 0xd0b898, 0x9aa8a0], tr: ['palm:3', 'shade:1'], far: 'river', farc: 0x4a7a90, lm: ['flare', 'bridgearch', 'tank', 'flare'], lmn: ['WARRI REFINERY', 'NIGER BRIDGE', 'EFFURUN TANKS', 'GAS FLARE'], veh: { tanker: 4, truck: 3, sedan: 2, keke: 3, okada: 2, bus: 1 }, vc: { tanker: [0xeeeeee], bus: [0x2f6dd0] }, tn: 12, kit: 'ur', amb: [1, 0.9, 1, 0], hawk: ['Pure water!', 'Oranges!', 'Roasted plantain!', 'Zobo!'] },
                p: [['Ovie', 'Oil Worker', 'ponzi', 'crude', 'm', 'How far, driver! A colleague says a new app will double my crude money. Many workers joined.'], ['Mama Ejiro', 'Fish Trader', 'seed', 'fish', 'f', 'Someone says support needs my 12 words to fix my wallet.'], ['Efe', 'Welder', 'p2p', 'welding', 'm', 'A buyer sent a screenshot for my USDT and says release it now.'], ['Ufuoma', 'Student', 'career', 'campus', 'f', 'I want a tech career. Where do I start with Web3?'], ['Pastor Tega', 'Pastor', 'skeptic', 'church', 'm', 'Is crypto not just gambling? Why should my church members bother?']] },
            edo: { st: ['Uselu', 'Ugbowo', 'New Benin Market', 'Oba Market', 'Benin Ring Road'], term: 'Ring Road',
                v: { sk: 'golden', gr: 0x7a7a48, gr2: 0xa86a42, rd: 'brick', rc: 0xa8584a, sh: 'cobble', shc: 0x9a7a62, bl: ['palace:5', 'compound:2', 'colonial:1'], pal: [0xa8583f, 0xb8664a, 0x98503a, 0xc8785a], tr: ['shade:3', 'palm:2'], far: 'hills', farc: 0x6a7a45, lm: ['palace', 'tower', 'palace', 'dome'], lmn: ['OBA\'S PALACE', 'BENIN MOAT WALLS', 'BRONZE QUARTER', 'RING ROAD ARCH'], veh: { sedan: 3, keke: 3, danfo: 3, okada: 3, truck: 1 }, vc: { danfo: [0xf5b014, 0x111111], keke: [0x1a7a3a] }, tn: 12, kit: 'ed', amb: [0.8, 1, 0.9, 0], hawk: ['Pure water!', 'Oranges!', 'Roasted plantain!', 'Zobo!'] },
                p: [['Osaze', 'Bronze Caster', 'art', 'bronze', 'm', 'Kedu, driver! A stranger wants to mint my bronze designs as NFTs for a verification fee.'], ['Mama Osarugue', 'Trader', 'ponzi', 'market', 'f', 'A woman says her app doubles my market money weekly.'], ['Iyobosa', 'Student', 'phish', 'campus', 'f', 'I connected my wallet to a free giveaway and lost everything.'], ['Eghosa', 'Okada Rider', 'cloudmine', 'okada', 'm', 'Someone promised daily profit from cloud mining for a small deposit.'], ['Chief Omoregie', 'Palace Chief', 'records', 'heritage', 'm', 'Can blockchain protect our heritage records from being altered?']] },
            rivers: { st: ['Rumuokoro', 'Rumuola', 'Trans-Amadi', 'Garrison', 'Mile 1'], term: 'Mile 1',
                v: { sk: 'storm', wx: 'rain', wxi: 1, gr: 0x3f6f45, rd: 'wet', rc: 0x26292e, sh: 'walk', shc: 0x77777a, med: 0x2f7a3a, bl: ['oil:3', 'highrise:2', 'lowblock:2', 'civic:1'], pal: [0xb0b8c0, 0xd0c8b8, 0x98a8b0, 0xc8b8a0], tr: ['palm:3', 'shade:2'], far: 'river', farc: 0x3f6a82, lm: ['flare', 'tower', 'tank', 'rig'], lmn: ['TRANS-AMADI FLARE', 'GARDEN CITY TOWER', 'REFINERY', 'PORT HARCOURT PORT'], veh: { sedan: 4, danfo: 3, tanker: 2, keke: 2, okada: 2, bus: 1 }, vc: { danfo: [0xf5b014, 0x111111], bus: [0x2f6dd0], tanker: [0xdddddd] }, tn: 12, kit: 'ur', amb: [1.1, 1, 1, 1.4], hawk: ['Pure water!', 'Umbrella! Umbrella!', 'Suya! Hot suya!', 'Zobo!'] },
                p: [['Dagogo', 'Oil Technician', 'ponzi', 'oil', 'm', 'How far, driver! A man says his staking pool doubles my oil allowance every month.'], ['Mama Blessing', 'Caterer', 'otp', 'catering', 'f', 'A caller says I won an airdrop and wants my OTP and BVN.'], ['Ibiene', 'Banker', 'taskjob', 'bank', 'f', 'A recruiter says I must pay a small deposit before I start my crypto task job.'], ['Boma', 'Student', 'approve', 'campus', 'm', 'This site keeps asking me to approve unlimited token spending. Is that fine?'], ['Mr. Okon', 'Contractor', 'meme', 'contract', 'm', 'My friends are buying meme coins with contract advances. Should I borrow to join?']] },
            benue: { st: ['Wurukum', 'High Level', 'Wadata Market', 'North Bank', 'Makurdi Bridge Head'], term: 'Makurdi Bridge',
                v: { sk: 'noon', gr: 0x84963f, gr2: 0xa8a64a, rd: 'asphalt', rc: 0x3a3733, sh: 'dirt', shc: 0xa8784a, bl: ['hut:4', 'farm:3', 'compound:2'], pal: [0xc8a070, 0xb88a5a, 0xd8b890, 0xa87a50], tr: ['shade:4', 'shrub:3'], bk: ['shade:4', 'shrub:3'], fld: [0x6a9a35, 0x88a63a, 0xb4a845, 0x5a8a30], far: 'river', farc: 0x5a8aa0, lm: ['bridgearch', 'tank', 'hill', 'tank'], lmn: ['RIVER BENUE BRIDGE', 'YAM BARNS', 'MAKURDI HILLS', 'GRAIN SILOS'], veh: { truck: 4, keke: 3, okada: 3, sedan: 2, bus: 1 }, vc: { keke: [0x2d8a3a] }, tn: 10, kit: 'jo', amb: [0.5, 0.8, 1.2, 0], hawk: ['Pure water!', 'Oranges!', 'Roasted yam and fish!', 'Zobo!'] },
                p: [['Terkimbi', 'Yam Farmer', 'ponzi', 'yam', 'm', 'Driver, a cooperative says my yam money doubles if I send it to one wallet.'], ['Mama Ene', 'Orange Seller', 'seed', 'orange', 'f', 'Someone claims to be wallet support and asks for my 12 words.'], ['Danladi', 'Trucker', 'p2p', 'truck', 'm', 'A buyer sent a screenshot and wants my USDT released immediately.'], ['Ladi', 'Student', 'career', 'campus', 'f', 'I want a tech career. How do I start with Web3?'], ['Mr. Audu', 'Cattle Trader', 'records', 'cattle', 'm', 'Can blockchain help record livestock sales honestly?']] },
            fct: { st: ['Wuse Market', 'Jabi', 'Garki', 'Nyanya', 'Utako'], term: 'Utako',
                v: { sk: 'noon', gr: 0x6a9250, rd: 'concrete', rc: 0x3c3c42, sh: 'walk', shc: 0xb4b4ac, med: 0x2f8a3a, bl: ['civic:4', 'highrise:3', 'lowblock:1'], pal: [0xeeeae0, 0xdcdcd0, 0xcfd8dc, 0xe8e0d0], tr: ['palm:2', 'shade:3'], far: 'rock', farc: 0x6a6a68, lm: ['zuma', 'dome', 'tower', 'obelisk'], lmn: ['ZUMA ROCK', 'NATIONAL MOSQUE', 'CENTRAL BUSINESS DISTRICT', 'EAGLE SQUARE'], veh: { cab: 5, sedan: 4, bus: 2, keke: 1, okada: 0 }, vc: { cab: [0x2e8b57, 0xffffff], bus: [0x2f8a3a] }, tn: 13, kit: 'ha', amb: [0.8, 0.9, 0.9, 0], hawk: ['Pure water!', 'Oranges!', 'Suya! Hot suya!', 'Zobo! Kunu!'] },
                p: [['Abdul', 'Civil Servant', 'phish', 'office', 'm', 'Good day, driver! A colleague connected his wallet to a free giveaway link and lost everything.'], ['Mrs. Okoro', 'Banker', 'otp', 'bank', 'f', 'A caller asked for my OTP to verify an airdrop. Should I give it?'], ['Ibrahim', 'Software Developer', 'approve', 'dApp', 'm', 'A dApp asks me to approve unlimited spending. Is that normal?'], ['Chiamaka', 'Startup Founder', 'rug', 'startup', 'f', 'Investors say a token will 100x. My team wants to put in our seed money.'], ['Mr. Danjuma', 'Retired Officer', 'skeptic', 'pension', 'm', 'Crypto is for scammers. Why should I learn it?']] },
            kogi: { st: ['Ganaja', 'Felele', 'Lokoja Market', 'Confluence Point', 'Lokoja Bridge'], term: 'Confluence Bridge',
                v: { sk: 'haze', wxi: 0.25, gr: 0x7a8a48, rd: 'asphalt', rc: 0x39352f, sh: 'dirt', shc: 0xa5714a, bl: ['colonial:2', 'hillhouse:3', 'compound:2', 'hut:1'], pal: [0xc8a878, 0xb8987a, 0xd8c098, 0xa8886a], tr: ['shade:3', 'shrub:3'], bk: ['rock:3', 'shade:3'], far: 'river', farc: 0x4f7f8a, lm: ['hill', 'bridgearch', 'rock', 'bridgearch'], lmn: ['MOUNT PATTI', 'NIGER BRIDGE', 'LOKOJA ROCKS', 'BENUE BRIDGE'], veh: { truck: 3, keke: 3, okada: 3, sedan: 2, bus: 2, danfo: 1 }, vc: {}, tn: 10, kit: 'jo', amb: [0.6, 0.8, 1.1, 0], hawk: ['Pure water!', 'Oranges!', 'Roasted fish!', 'Zobo!'] },
                p: [['Abu', 'Boatman', 'ponzi', 'boat', 'm', 'Good day, driver! A man says my boat money doubles if I stake it with his group.'], ['Mama Ojone', 'Trader', 'seed', 'market', 'f', 'Someone says I should send my 12 words to verify my wallet.'], ['Salihu', 'Student', 'taskjob', 'campus', 'm', 'A recruiter wants a deposit before I start paid crypto tasks.'], ['Ada', 'Nurse', 'coop', 'clinic', 'f', 'Our nurses want to start a digital savings group. How do we stay safe?'], ['Pa Ibrahim', 'Retired Teacher', 'skeptic', 'school', 'm', 'Why should I trust crypto?']] },
            kwara: { st: ['Tanke', 'Ipata Market', 'Gaa Akanbi', 'Challenge', 'Emir\'s Road'], term: 'Challenge',
                v: { sk: 'sand', wxi: 0.2, gr: 0x9a9456, rd: 'asphalt', rc: 0x3a3733, sh: 'dirt', shc: 0xb08858, bl: ['mud:3', 'compound:3', 'mosque:1'], pal: [0xd0b080, 0xc8a070, 0xe0c898, 0xb88a5a], tr: ['shade:3', 'acacia:2'], bk: ['acacia:4', 'shrub:3'], far: 'hills', farc: 0x8a8050, lm: ['minaret', 'rock', 'dome', 'hill'], lmn: ['CENTRAL MOSQUE', 'ILORIN ROCKS', 'EMIR\'S PALACE', 'SOBI HILL'], veh: { sedan: 3, keke: 4, okada: 3, truck: 2, danfo: 2 }, vc: { danfo: [0xf5b014, 0x111111], keke: [0xe0a020] }, tn: 11, kit: 'yo', amb: [0.8, 1, 1, 0], hawk: ['Pure water!', 'Oranges!', 'Suya! Hot suya!', 'Kunu! Zobo!'] },
                p: [['Sulyman', 'Student', 'phish', 'campus', 'm', 'Hello, driver! A giveaway page asked me to connect my wallet and it is empty now.'], ['Alhaja Zainab', 'Fabric Trader', 'ponzi', 'fabric', 'f', 'A woman says her app doubles my fabric money every month.'], ['Bola', 'Teacher', 'backup', 'school', 'f', 'I just made a wallet. Where should I keep the recovery words?'], ['Yusuf', 'Motorcycle Mechanic', 'apk', 'repair', 'm', 'A customer sent me a wallet APK in WhatsApp. Safe to install?'], ['Mr. Ajibola', 'Retired Soldier', 'skeptic', 'pension', 'm', 'Is crypto even real?']] },
            nasarawa: { st: ['Karu', 'Lafia Market', 'Keffi Road', 'Mararaba', 'Lafia Minerals Yard'], term: 'Lafia Central',
                v: { sk: 'noon', gr: 0x8a9648, rd: 'asphalt', rc: 0x3a3733, sh: 'dirt', shc: 0xb08a58, bl: ['hut:3', 'farm:2', 'silo:2', 'compound:2'], pal: [0xd0b080, 0xc89a68, 0xe0c898, 0xb08858], tr: ['shade:3', 'shrub:3'], bk: ['shade:4', 'rock:2'], fld: [0x7a9a3a, 0xa8a84a, 0x8a9a34], far: 'hills', farc: 0x7a8a48, lm: ['tank', 'rock', 'tank', 'hill'], lmn: ['MARBLE QUARRY', 'KARU ROCKS', 'SALT WORKS', 'ASSAKIO HILLS'], veh: { truck: 4, keke: 3, okada: 2, sedan: 2, bus: 1 }, vc: { keke: [0x2d8a3a] }, tn: 10, kit: 'jo', amb: [0.5, 0.7, 1.1, 0], hawk: ['Pure water!', 'Oranges!', 'Roasted yam!', 'Zobo!'] },
                p: [['Samuel', 'Quarry Worker', 'ponzi', 'quarry', 'm', 'A group says staking will double my quarry money every week.'], ['Mama Rhoda', 'Farmer', 'seed', 'farm', 'f', 'Support says they need my 12 words to unlock my wallet.'], ['Ibrahim', 'Driver', 'p2p', 'truck', 'm', 'A buyer sent a bank alert screenshot for my USDT. Should I release it?'], ['Grace', 'Student', 'career', 'campus', 'f', 'Where does a beginner start in Web3?'], ['Pastor Isaac', 'Pastor', 'records', 'church', 'm', 'Could blockchain help our church keep honest donation records?']] },
            niger: { st: ['Bosso', 'Tunga', 'Kpakungu', 'Chanchaga', 'Kainji Road'], term: 'Minna Central',
                v: { sk: 'haze', wxi: 0.35, gr: 0x95904f, gr2: 0xa8985a, rd: 'asphalt', rc: 0x3a3733, sh: 'dirt', shc: 0xb08a58, bl: ['mud:3', 'hut:3', 'compound:2', 'mosque:1'], pal: [0xd0b080, 0xc89a68, 0xe0c898, 0xb88a5a], tr: ['shade:2', 'acacia:3'], bk: ['acacia:4', 'rock:3'], fld: [0x8a9a3a, 0xb0a44a], far: 'rock', farc: 0x7a7060, lm: ['zuma', 'dome', 'rock', 'tank'], lmn: ['GURARA ROCKS', 'MINNA CENTRAL MOSQUE', 'KAINJI RIDGE', 'DAM SPILLWAY'], veh: { truck: 3, keke: 4, okada: 3, sedan: 2, bus: 1 }, vc: { keke: [0xe0a020] }, tn: 10, kit: 'nu', amb: [0.5, 0.8, 1.3, 0], hawk: ['Pure water!', 'Oranges!', 'Suya! Hot suya!', 'Kunu! Zobo!'] },
                p: [['Mohammed', 'Rice Farmer', 'ponzi', 'rice', 'm', 'Good day, driver! A man says my rice money will double if I stake it with his group.'], ['Hajiya Maryam', 'Trader', 'seed', 'market', 'f', 'Someone says I must send my 12 words to confirm my wallet.'], ['Yakubu', 'Dam Technician', 'xfer', 'dam', 'm', 'I want to receive crypto from my brother abroad. How can I avoid mistakes?'], ['Aisha', 'Student', 'taskjob', 'campus', 'f', 'A recruiter wants a deposit before I start paid tasks.'], ['Malam Sani', 'Teacher', 'skeptic', 'school', 'm', 'Crypto is only for tricksters, no?']] },
            plateau: { st: ['Rayfield', 'Bukuru', 'Terminus Market', 'Zaria Road', 'Jos Zoo'], term: 'Terminus',
                v: { sk: 'mist', wx: 'mist', wxi: 0.8, gr: 0x6a8a52, rd: 'asphalt', rc: 0x34363a, sh: 'grass', shc: 0x6a9a58, bl: ['tin:4', 'hillhouse:3', 'farm:2'], pal: [0xc8b8a0, 0xb0a890, 0xd8c8b0, 0xa8a090], tr: ['pine:4', 'shade:2', 'shrub:3'], bk: ['pine:5', 'rock:4'], fld: [0x5a8a34, 0x8aa83e, 0x6a9a38], far: 'hills', farc: 0x5a6a5a, lm: ['rock', 'hill', 'rock', 'tower'], lmn: ['SHERE HILLS', 'JOS ROCKS', 'TIN CITY', 'PLATEAU TOWER'], veh: { sedan: 3, keke: 3, truck: 3, okada: 1, bus: 2 }, vc: { bus: [0x2f6dd0] }, tn: 10, kit: 'jo', amb: [0.5, 0.7, 1.4, 0], hawk: ['Pure water!', 'Irish potatoes!', 'Roasted maize!', 'Zobo!'] },
                p: [['Dung', 'Potato Farmer', 'ponzi', 'potato', 'm', 'Driver, a cooperative says my potato money doubles on their new app.'], ['Mama Ladi', 'Vegetable Seller', 'seed', 'vegetable', 'f', 'A stranger wants my 12 words to recover my wallet.'], ['Pam', 'Student', 'career', 'campus', 'm', 'Is there a place for me in Web3 from Jos?'], ['Nandi', 'Hotelier', 'romance', 'hotel', 'f', 'A man online says he will send me money if I buy crypto for him first.'], ['Mr. Gyang', 'Miner', 'meme', 'mining', 'm', 'My friends are buying meme coins. I want to borrow to join them.']] },
            jigawa: { st: ['Dutse Market', 'Hadejia Road', 'Birnin Kudu', 'Kazaure Junction', 'Dutse Roundabout'], term: 'Dutse Central',
                v: { sk: 'haze', wx: 'dust', wxi: 0.5, gr: 0xb3a374, rd: 'sand', rc: 0xb8a070, sh: 'sand', shc: 0xc8b484, bl: ['mud:5', 'mosque:1', 'hut:2'], pal: [0xd8c3a0, 0xcdb590, 0xe3d3b5, 0xbfa885], tr: ['acacia:3', 'shrub:2'], bk: ['acacia:4', 'shrub:3'], far: 'dunes', farc: 0xc8b080, lm: ['minaret', 'dome', 'minaret', 'tank'], lmn: ['DUTSE MOSQUE', 'HADEJIA WETLANDS', 'RICE MILL', 'MARKET SILOS'], veh: { keke: 4, okada: 4, truck: 2, sedan: 2, bus: 1 }, vc: { keke: [0xe0a020] }, tn: 8, kit: 'ha', amb: [0.4, 0.7, 1.5, 0], hawk: ['Ruwa! Cold water!', 'Lemo! Oranges!', 'Tsire! Hot suya!', 'Kunu! Cold kunu!'] },
                p: [['Musa', 'Sesame Farmer', 'ponzi', 'sesame', 'm', 'Sannu, driver! A group says my sesame money will double in a week.'], ['Hajiya Amina', 'Trader', 'seed', 'market', 'f', 'Someone says he must hold my 12 words to fix my wallet.'], ['Sani', 'Student', 'cloudmine', 'campus', 'm', 'A man promises daily mining profit for a small deposit.'], ['Zainab', 'Teacher', 'backup', 'school', 'f', 'I made a wallet. How do I keep my recovery words safe?'], ['Malam Ibrahim', 'Elder', 'skeptic', 'market', 'm', 'Is crypto not just a game for young people?']] },
            kaduna: { st: ['Kawo', 'Barnawa', 'Sabon Tasha', 'Ahmadu Bello Way', 'Kaduna Rail Station'], term: 'Rail Station',
                v: { sk: 'noon', wxi: 0.15, gr: 0x9a9a58, rd: 'asphalt', rc: 0x35353a, sh: 'walk', shc: 0xa8a8a0, bl: ['silo:3', 'lowblock:3', 'colonial:2', 'mosque:1'], pal: [0xd8c8a8, 0xc8b898, 0xe0d4b8, 0xb8a888], tr: ['shade:3', 'acacia:2'], far: 'hills', farc: 0x8a8a58, lm: ['tower', 'dome', 'tank', 'minaret'], lmn: ['KADUNA TOWER', 'MURTALA SQUARE', 'TEXTILE MILL', 'KADUNA MOSQUE'], veh: { sedan: 3, keke: 3, bus: 2, truck: 2, okada: 2, danfo: 1 }, vc: { bus: [0x2f6dd0], danfo: [0xf5b014, 0x111111] }, tn: 11, kit: 'ha', amb: [0.8, 0.9, 1, 0], hawk: ['Ruwa! Pure water!', 'Lemo! Oranges!', 'Tsire! Hot suya!', 'Kunu! Cold kunu!'] },
                p: [['Yusuf', 'Textile Worker', 'ponzi', 'textile', 'm', 'Sannu, driver! A man says my textile money doubles every week with his app.'], ['Hajiya Rabi', 'Trader', 'seed', 'market', 'f', 'Someone says I must give my 12 words to verify my wallet.'], ['Emmanuel', 'Student', 'taskjob', 'campus', 'm', 'A recruiter wants a deposit before I start paid tasks.'], ['Binta', 'Nurse', 'otp', 'clinic', 'f', 'A caller asked for my OTP to verify an airdrop.'], ['Malam Garba', 'Retired Railway Clerk', 'records', 'rail', 'm', 'Could blockchain help keep rail records honest?']] },
            kano: { st: ['Sabon Gari', 'Kurmi Market', 'Zoo Road', 'Fagge', 'Bompai'], term: 'Bompai',
                v: { sk: 'haze', wx: 'dust', wxi: 0.8, gr: 0xb3a374, gr2: 0xc8b484, rd: 'asphalt', rc: 0x3c3935, sh: 'sand', shc: 0xc4b080, bl: ['mud:5', 'market:3', 'mosque:1'], pal: [0xd9c3a0, 0xcdb590, 0xe3d3b5, 0xbfa885, 0xd4b48a], tr: ['shade:2', 'acacia:2'], far: 'dunes', farc: 0xc8b080, lm: ['minaret', 'tower', 'dome', 'minaret'], lmn: ['KANO CENTRAL MOSQUE', 'DALA HILL', 'KURMI MARKET', 'GIDAN MAKAMA'], veh: { keke: 6, okada: 4, truck: 2, sedan: 2, bus: 1 }, vc: { keke: [0xe0a020], bus: [0x2f8a3a] }, tn: 15, kit: 'ha', amb: [1.3, 1.7, 1.2, 0], hawk: ['Ruwa! Cold water!', 'Lemo! Oranges!', 'Tsire! Hot suya!', 'Kunu! Fura da nono!'] },
                p: [['Musa', 'Leather Trader', 'ponzi', 'leather', 'm', 'Sannu, driver! A man says my leather money doubles every week in his app.'], ['Hajiya Amina', 'Fabric Seller', 'seed', 'fabric', 'f', 'Someone says I must give my 12 words to confirm my wallet.'], ['Bashir', 'Dye Pit Worker', 'p2p', 'dye', 'm', 'A buyer sent a screenshot of payment for my USDT. Should I release it?'], ['Zainab', 'Student', 'career', 'campus', 'f', 'I want a Web3 career. Where do I start?'], ['Malam Ibrahim', 'Market Elder', 'skeptic', 'market', 'm', 'Is crypto not for people who gamble?']] },
            katsina: { st: ['Kofar Marusa', 'Kofar Kaura', 'Daura Road', 'Funtua Junction', 'Katsina Durbar Ground'], term: 'Durbar Ground',
                v: { sk: 'haze', wx: 'dust', wxi: 0.7, gr: 0xb3a374, gr2: 0xc8b484, rd: 'sand', rc: 0xb8a070, sh: 'sand', shc: 0xc8b484, bl: ['mud:5', 'mosque:1', 'hut:2'], pal: [0xd9c3a0, 0xcdb590, 0xe3d3b5, 0xbfa885], tr: ['acacia:3', 'shrub:2'], bk: ['acacia:4', 'shrub:3'], far: 'dunes', farc: 0xc8b080, lm: ['minaret', 'dome', 'minaret', 'tank'], lmn: ['KATSINA MOSQUE', 'GOBARAU MINARET', 'DAURA FORT', 'DURBAR GROUND'], veh: { keke: 4, okada: 4, truck: 2, sedan: 2, bus: 1 }, vc: { keke: [0xe0a020] }, tn: 9, kit: 'ha', amb: [0.4, 0.8, 1.5, 0], hawk: ['Ruwa! Cold water!', 'Lemo!', 'Tsire! Hot suya!', 'Kunu!'] },
                p: [['Aminu', 'Horse Keeper', 'ponzi', 'horse', 'm', 'Sannu, driver! A group says my horse money doubles every week.'], ['Hauwa', 'Teacher', 'seed', 'school', 'f', 'Someone says he must hold my 12 words to fix my wallet.'], ['Sagir', 'Student', 'cloudmine', 'campus', 'm', 'A man promises daily profit from cloud mining.'], ['Rukayya', 'Trader', 'xfer', 'trade', 'f', 'I want to receive USDT from my cousin abroad. How do I avoid mistakes?'], ['Malam Lawal', 'Elder', 'skeptic', 'market', 'm', 'Is crypto real business?']] },
            kebbi: { st: ['Birnin Kebbi Market', 'Argungu Road', 'Kalgo Junction', 'Rice Fields', 'Fishing Ground'], term: 'Argungu Ground',
                v: { sk: 'golden', gr: 0x8a9a48, gr2: 0xa8a24a, rd: 'asphalt', rc: 0x3a3733, sh: 'dirt', shc: 0xb08858, bl: ['mud:3', 'hut:3', 'dry:2', 'silo:1'], pal: [0xd0b080, 0xc89a68, 0xe0c898, 0xb88a5a], tr: ['shade:3', 'acacia:2', 'palm:1'], fld: [0x6a9a35, 0x88a63a, 0xa8a84a], far: 'river', farc: 0x5a8a9a, lm: ['tank', 'minaret', 'tank', 'dome'], lmn: ['RICE MILL', 'KEBBI MOSQUE', 'ARGUNGU FISHERIES', 'RIVER BASIN'], veh: { truck: 3, keke: 4, okada: 4, sedan: 2, bus: 1 }, vc: { keke: [0xe0a020] }, tn: 9, kit: 'ha', amb: [0.4, 0.8, 1.2, 0], hawk: ['Ruwa! Cold water!', 'Lemo!', 'Tsire! Hot suya!', 'Kunu!'] },
                p: [['Sule', 'Fisherman', 'ponzi', 'fish', 'm', 'Sannu, driver! A man says my fish money doubles every week.'], ['Hajiya Halima', 'Rice Trader', 'seed', 'rice', 'f', 'Someone says I must send my 12 words to fix my wallet.'], ['Garba', 'Student', 'p2p', 'campus', 'm', 'A buyer sent a screenshot and wants my USDT right now.'], ['Maryam', 'Teacher', 'otp', 'school', 'f', 'A caller asked for my OTP for an airdrop.'], ['Malam Abdullahi', 'Elder', 'skeptic', 'market', 'm', 'Is crypto not just for the idle?']] },
            sokoto: { st: ['Sokoto Central Market', 'Kofar Rini', 'Gwiwa Junction', 'Wamakko Road', 'Sokoto Caravan Park'], term: 'Caravan Park',
                v: { sk: 'sand', wx: 'dust', wxi: 0.6, gr: 0xc0aa78, gr2: 0xd0b888, rd: 'sand', rc: 0xc4a874, sh: 'sand', shc: 0xd0b888, bl: ['mud:5', 'mosque:1', 'hut:2'], pal: [0xe0c898, 0xd8bc88, 0xe8d4a8, 0xc8a870], tr: ['acacia:3', 'shrub:3'], bk: ['acacia:4', 'shrub:4'], far: 'dunes', farc: 0xd0b480, lm: ['minaret', 'dome', 'minaret', 'tank'], lmn: ['SOKOTO MOSQUE', 'SULTANATE QUARTER', 'LEATHER MARKET', 'CARAVAN GATE'], veh: { keke: 3, okada: 4, truck: 3, sedan: 2, bus: 1 }, vc: { keke: [0xe0a020] }, tn: 9, kit: 'fu', amb: [0.4, 0.8, 1.6, 0], hawk: ['Ruwa! Cold water!', 'Lemo!', 'Tsire! Hot suya!', 'Kunu! Fura da nono!'] },
                p: [['Bello', 'Herder', 'ponzi', 'cattle', 'm', 'Sannu, driver! A man says my cattle money doubles every week.'], ['Hauwa', 'Milk Seller', 'seed', 'milk', 'f', 'Someone says he must hold my 12 words to fix my wallet.'], ['Ibrahim', 'Leather Worker', 'p2p', 'leather', 'm', 'A buyer sent a screenshot and wants my USDT right now.'], ['Aisha', 'Student', 'career', 'campus', 'f', 'Where can a beginner start in Web3?'], ['Alhaji Sambo', 'Elder', 'skeptic', 'market', 'm', 'Is crypto not just gambling?']] },
            zamfara: { st: ['Gusau Market', 'Tudun Wada', 'Kaura Namoda Road', 'Talata Mafara', 'Gusau Roundabout'], term: 'Gusau Central',
                v: { sk: 'haze', wx: 'dust', wxi: 0.4, gr: 0xa8a066, rd: 'sand', rc: 0xb0a070, sh: 'sand', shc: 0xc0b078, bl: ['mud:4', 'hut:3', 'silo:1', 'mosque:1'], pal: [0xd8c3a0, 0xcdb590, 0xe3d3b5, 0xbfa885], tr: ['acacia:3', 'shrub:3'], bk: ['acacia:4', 'shrub:3'], fld: [0x8a9a3a, 0xb0a44a], far: 'dunes', farc: 0xc0aa78, lm: ['minaret', 'tank', 'dome', 'tank'], lmn: ['GUSAU MOSQUE', 'GROUNDNUT PYRAMIDS', 'COTTON GINNERY', 'TOWN GATE'], veh: { keke: 4, okada: 4, truck: 3, sedan: 1, bus: 1 }, vc: { keke: [0xe0a020] }, tn: 8, kit: 'ha', amb: [0.4, 0.7, 1.4, 0], hawk: ['Ruwa! Cold water!', 'Lemo!', 'Tsire! Hot suya!', 'Kunu!'] },
                p: [['Bashir', 'Groundnut Farmer', 'ponzi', 'groundnut', 'm', 'Sannu, driver! A group says my groundnut money doubles in a week.'], ['Hajiya Safiya', 'Trader', 'seed', 'market', 'f', 'Someone says I must send my 12 words to fix my wallet.'], ['Abubakar', 'Student', 'taskjob', 'campus', 'm', 'A recruiter wants a deposit before I start paid tasks.'], ['Fatima', 'Teacher', 'coop', 'school', 'f', 'We want to start a digital savings group. How do we stay safe?'], ['Malam Yahaya', 'Elder', 'skeptic', 'market', 'm', 'Is crypto real business?']] },
            adamawa: { st: ['Jimeta Market', 'Yola Bypass', 'Mubi Road', 'Girei Junction', 'Jimeta Bridge Head'], term: 'Jimeta Bridge',
                v: { sk: 'golden', gr: 0x8a9650, rd: 'asphalt', rc: 0x3a3733, sh: 'dirt', shc: 0xb08858, bl: ['hut:3', 'hillhouse:3', 'compound:2', 'mosque:1'], pal: [0xd0b080, 0xc89a68, 0xe0c898, 0xb88a5a], tr: ['shade:3', 'acacia:2'], bk: ['rock:4', 'shade:3'], far: 'hills', farc: 0x7a7a58, lm: ['hill', 'bridgearch', 'rock', 'hill'], lmn: ['MOUNT MAMBILLA', 'JIMETA BRIDGE', 'MUBI HILLS', 'ADAMAWA RIDGE'], veh: { truck: 3, keke: 4, okada: 4, sedan: 2, bus: 1 }, vc: { keke: [0xe0a020] }, tn: 9, kit: 'fu', amb: [0.5, 0.8, 1.2, 0], hawk: ['Ruwa! Cold water!', 'Lemo!', 'Tsire!', 'Kunu!'] },
                p: [['Bulus', 'Ginger Farmer', 'ponzi', 'ginger', 'm', 'Driver, a group says my ginger money doubles each week.'], ['Hajiya Binta', 'Trader', 'seed', 'market', 'f', 'Someone says he must have my 12 words to fix my wallet.'], ['Ahmadu', 'Student', 'career', 'campus', 'm', 'Is there a place for me in Web3 from Adamawa?'], ['Naomi', 'Nurse', 'otp', 'clinic', 'f', 'A caller asked for my OTP for an airdrop.'], ['Pa Jibrin', 'Elder', 'skeptic', 'market', 'm', 'Is crypto just gambling?']] },
            bauchi: { st: ['Bauchi Market', 'Yelwa', 'Jos Road', 'Gombe Road', 'Yankari Gate'], term: 'Yankari Gate',
                v: { sk: 'sand', gr: 0x9a9a58, rd: 'asphalt', rc: 0x3a3733, sh: 'dirt', shc: 0xb08858, bl: ['mud:3', 'compound:2', 'hut:2', 'mosque:1'], pal: [0xd0b080, 0xc89a68, 0xe0c898, 0xb88a5a], tr: ['acacia:4', 'shade:2', 'shrub:2'], bk: ['acacia:5', 'rock:3'], far: 'hills', farc: 0x8a8050, lm: ['rock', 'hill', 'minaret', 'rock'], lmn: ['YANKARI ROCKS', 'WIKKI SPRINGS RIDGE', 'BAUCHI MOSQUE', 'GAME RESERVE GATE'], veh: { keke: 4, okada: 4, truck: 2, sedan: 2, bus: 2 }, vc: { keke: [0xe0a020], bus: [0x2f6dd0] }, tn: 9, kit: 'ha', amb: [0.5, 0.8, 1.2, 0], hawk: ['Ruwa! Cold water!', 'Lemo!', 'Tsire!', 'Kunu!'] },
                p: [['Abdullahi', 'Park Ranger', 'ponzi', 'park', 'm', 'Sannu, driver! A man says my salary doubles on his app every week.'], ['Hajiya Zuwaira', 'Trader', 'seed', 'market', 'f', 'Someone says I must send my 12 words to fix my wallet.'], ['Yahaya', 'Student', 'cloudmine', 'campus', 'm', 'A man promises daily profit from cloud mining.'], ['Hadiza', 'Tour Operator', 'romance', 'tour', 'f', 'A tourist I met online wants me to buy crypto for him first.'], ['Malam Danjuma', 'Elder', 'skeptic', 'market', 'm', 'Is crypto real?']] },
            borno: { st: ['Monday Market', 'Gamboru Market', 'Baga Road', 'Customs Junction', 'Maiduguri Lake Park'], term: 'Lake Park',
                v: { sk: 'sand', wx: 'dust', wxi: 0.7, gr: 0xc0aa78, gr2: 0xd0b888, rd: 'sand', rc: 0xc0a470, sh: 'sand', shc: 0xd0b888, bl: ['mud:4', 'dry:2', 'hut:2', 'mosque:1'], pal: [0xe0c898, 0xd8bc88, 0xe8d4a8, 0xc8a870], tr: ['acacia:3', 'shrub:3'], bk: ['acacia:4', 'shrub:4'], far: 'dunes', farc: 0xd0b480, lm: ['minaret', 'dome', 'tank', 'minaret'], lmn: ['MAIDUGURI MOSQUE', 'MONDAY MARKET', 'LAKE CHAD FISHERIES', 'RECOVERY CITY'], veh: { keke: 5, okada: 4, truck: 2, sedan: 1, bus: 1 }, vc: { keke: [0xe0a020] }, tn: 9, kit: 'kn', amb: [0.5, 0.9, 1.4, 0], hawk: ['Ruwa! Cold water!', 'Lemo!', 'Tsire! Hot suya!', 'Kunu!'] },
                p: [['Bukar', 'Fisherman', 'ponzi', 'fish', 'm', 'Sannu, driver! A man says my fish money doubles every week.'], ['Hajiya Falmata', 'Trader', 'seed', 'market', 'f', 'Someone says he must hold my 12 words to fix my wallet.'], ['Modu', 'Student', 'career', 'campus', 'm', 'Where can a beginner start in Web3?'], ['Hauwa', 'Nurse', 'otp', 'clinic', 'f', 'A caller asked for my OTP for an airdrop.'], ['Malam Umar', 'Elder', 'skeptic', 'market', 'm', 'Is crypto not just tricks?']] },
            gombe: { st: ['Pantami', 'Tudun Wada', 'Kwami Road', 'Dukku Junction', 'Gombe Dam Road'], term: 'Gombe Dam',
                v: { sk: 'golden', gr: 0x959a50, rd: 'asphalt', rc: 0x3a3733, sh: 'dirt', shc: 0xb08858, bl: ['mud:3', 'hut:3', 'farm:2', 'mosque:1'], pal: [0xd0b080, 0xc89a68, 0xe0c898, 0xb88a5a], tr: ['acacia:3', 'shade:3'], fld: [0xe8e0d0, 0x8a9a3a, 0xa8a84a], far: 'hills', farc: 0x7a8050, lm: ['hill', 'tank', 'minaret', 'rock'], lmn: ['KWAMI DAM RIDGE', 'COTTON GINNERY', 'GOMBE MOSQUE', 'DUKKU ROCKS'], veh: { keke: 4, okada: 4, truck: 3, sedan: 2, bus: 1 }, vc: { keke: [0xe0a020] }, tn: 9, kit: 'ha', amb: [0.5, 0.8, 1.2, 0], hawk: ['Ruwa! Cold water!', 'Lemo!', 'Tsire!', 'Kunu!'] },
                p: [['Isa', 'Cotton Farmer', 'ponzi', 'cotton', 'm', 'Sannu, driver! A man says my cotton money doubles every week.'], ['Hajiya Rabi', 'Trader', 'seed', 'market', 'f', 'Someone says I must send my 12 words to fix my wallet.'], ['Aliyu', 'Student', 'taskjob', 'campus', 'm', 'A recruiter wants a deposit before I start paid tasks.'], ['Hauwa', 'Teacher', 'backup', 'school', 'f', 'I made a wallet. Where do I keep my recovery words?'], ['Malam Dahiru', 'Elder', 'skeptic', 'market', 'm', 'Is crypto just for gamblers?']] },
            taraba: { st: ['Jalingo Market', 'Mile Six', 'Wukari Road', 'Bali Junction', 'Mambilla Foot'], term: 'Mambilla Foot',
                v: { sk: 'mist', wx: 'mist', wxi: 0.9, gr: 0x5f8a4a, rd: 'laterite', rc: 0xa8603e, sh: 'grass', shc: 0x6a9a58, bl: ['hut:4', 'hillhouse:3', 'tin:2'], pal: [0xc8a070, 0xb88a5a, 0xd8b890, 0xa87a50], tr: ['pine:3', 'shade:3', 'shrub:3'], bk: ['pine:5', 'rock:4'], far: 'hills', farc: 0x4f6a52, lm: ['hill', 'rock', 'hill', 'tower'], lmn: ['MAMBILLA PLATEAU', 'GASHAKA RIDGE', 'TARABA PEAKS', 'JALINGO TOWER'], veh: { truck: 3, keke: 3, okada: 4, sedan: 2, bus: 1 }, vc: {}, tn: 8, kit: 'jo', amb: [0.4, 0.7, 1.3, 0], hawk: ['Pure water!', 'Oranges!', 'Roasted maize!', 'Zobo!'] },
                p: [['Danjuma', 'Tea Farmer', 'ponzi', 'tea', 'm', 'Good day, driver! A group says my tea money doubles in a week.'], ['Mama Ladi', 'Trader', 'seed', 'market', 'f', 'Someone says I must give my 12 words to fix my wallet.'], ['Sunday', 'Student', 'career', 'campus', 'm', 'Is there a Web3 path for people from Taraba?'], ['Hannatu', 'Nurse', 'otp', 'clinic', 'f', 'A caller asked for my OTP for an airdrop.'], ['Pa Garba', 'Elder', 'skeptic', 'market', 'm', 'Crypto sounds like gambling.']] },
            yobe: { st: ['Damaturu Market', 'Potiskum Road', 'Gashua Junction', 'Nguru Road', 'Damaturu Roundabout'], term: 'Damaturu Central',
                v: { sk: 'sand', wx: 'dust', wxi: 0.9, gr: 0xc0aa78, gr2: 0xd0b888, rd: 'sand', rc: 0xc0a470, sh: 'sand', shc: 0xd0b888, bl: ['mud:4', 'hut:3', 'mosque:1'], pal: [0xe0c898, 0xd8bc88, 0xe8d4a8, 0xc8a870], tr: ['acacia:3', 'shrub:3'], bk: ['acacia:4', 'shrub:5'], far: 'dunes', farc: 0xd0b480, lm: ['minaret', 'dome', 'minaret', 'tank'], lmn: ['DAMATURU MOSQUE', 'SAHEL GATE', 'GASHUA WETLANDS', 'DESERT HIGHWAY'], veh: { keke: 4, okada: 4, truck: 3, sedan: 1, bus: 1 }, vc: { keke: [0xe0a020] }, tn: 8, kit: 'kn', amb: [0.3, 0.7, 1.8, 0], hawk: ['Ruwa! Cold water!', 'Lemo!', 'Tsire!', 'Kunu!'] },
                p: [['Ibrahim', 'Date Trader', 'ponzi', 'date', 'm', 'Sannu, driver! A man says my date money doubles each week.'], ['Hajiya Aisha', 'Trader', 'seed', 'market', 'f', 'Someone says he must hold my 12 words to fix my wallet.'], ['Muhammad', 'Student', 'cloudmine', 'campus', 'm', 'A man promises daily profit from cloud mining.'], ['Hafsat', 'Teacher', 'backup', 'school', 'f', 'I made a wallet. Where do I keep my recovery words?'], ['Malam Adamu', 'Elder', 'skeptic', 'market', 'm', 'Is crypto real business?']] }
        });
        // fix slug keys
        

        const TH = STATES[NGS.id] || STATES.lagos, V = TH.v, SK = SKY[V.sk] || SKY.noon;
        if (TH.st) NGS.stops = TH.st.slice(0, 5);
        if (TH.term) NGS.term = TH.term;
        const subC = (t, c) => t.replace(/\{c\}/g, c);
        if (TH.p) {
            PASSENGERS.length = 0;
            TH.p.forEach((a, i) => {
                const T = TOPICS[a[2]], c = a[3];
                PASSENGERS.push({ name: a[0], role: a[1], stop: NGS.stops[i], g: a[4], line: '"' + a[5] + '"',
                    options: [{ text: subC(T[0], c), correct: true }, { text: subC(T[1], c), feedback: subC(T[2], c) }, { text: subC(T[3], c), feedback: subC(T[4], c) }],
                    thanks: subC(T[5], c), tip: T[6] });
            });
        } else PASSENGERS.forEach(p => { p.g = /Ngozi|Aisha/.test(p.name) ? 'f' : 'm'; });
        const VKEY = 'kitcity_states_v1';
        function getVisited() { try { return JSON.parse(localStorage.getItem(VKEY) || '[]'); } catch (e) { return []; } }
        function markVisited(id) { try { const v = getVisited(); if (v.indexOf(id) < 0) { v.push(id); localStorage.setItem(VKEY, JSON.stringify(v)); } } catch (e) {} }
        function teardown() {
            dead = true;
            try { if (street) { street.pause(); street = null; } } catch (e) {}
            try { if (actx && actx.close) actx.close(); } catch (e) {}
            try { if (fmPlayer && fmPlayer.destroy) fmPlayer.destroy(); } catch (e) {}
            try { renderer.dispose(); if (renderer.forceContextLoss) renderer.forceContextLoss(); } catch (e) {}
        }
        function restartGame(id) {
            try { history.replaceState(null, '', '#' + id); } catch (e) {}
            try { teardown(); } catch (e) {}
            window.location.reload();
        }
        function goState(id) { restartGame(id); }

        // start screen: state picker
        (function () {
            const sel = $('state-sel'), seen = getVisited();
            ['SW', 'SE', 'SS', 'NC', 'NW', 'NE'].forEach(zk => {
                const og = document.createElement('optgroup'); og.label = ZONES[zk].label;
                NG_LIST.filter(r => r[2] === zk).forEach(r => {
                    const o = document.createElement('option'); o.value = slugState(r[0]);
                    o.textContent = (r[0] === 'FCT' ? 'FCT' : r[0]) + ' - ' + r[1] + (seen.indexOf(slugState(r[0])) >= 0 ? '  ✓' : '');
                    if (slugState(r[0]) === NGS.id) o.selected = true;
                    og.appendChild(o);
                });
                sel.appendChild(og);
            });
            sel.addEventListener('change', () => goState(sel.value));
            $('state-progress').textContent = 'States completed: ' + seen.length + ' / ' + NG_LIST.length;
            $('start-chapter').textContent = 'CHAPTER 1  -  ' + NGS.label.toUpperCase();
            $('start-sub').textContent = 'Drive your danfo through ' + NGS.city + ' to KitCity. Pick up 5 passengers along the way and help each one understand Web3 safely, the T3Kit way.';
            $('hud-state').textContent = NGS.name + ' (' + NGS.city + ' Hub)';
            $('end-chapter').textContent = 'KITCITY ARRIVAL  ·  ' + NGS.label.toUpperCase();
            $('btn-next').addEventListener('click', () => {
                const i = NG_LIST.findIndex(r => slugState(r[0]) === NGS.id);
                goState(slugState(NG_LIST[(i + 1) % NG_LIST.length][0]));
            });
        })();

        // ============================================================
        // 2. STATE
        // ============================================================
        const state = { started: false, ended: false, dialogue: false, radio: false };
        let impactScore = 0, onboarded = 0, delivered = 0, collisions = 0, streak = 0;
        let curIdx = 0, attemptWrong = false, vibe = 50;
        let elapsed = 0, camMode = 'chase', shake = 0, collideCD = 0, missedCD = 0;
        let snapCamera = true;

        const car = { x: 11.5, z: START_Z, h: 0, speed: 0, steer: 0, steerIn: 0, prevSpeed: 0, yawRate: 0 };
        let target = null;

        // ============================================================
        // 3. RENDERER / SCENE
        // ============================================================
        const scene = new THREE.Scene();
        const FOG0 = SK.fd * 0.58 * (1 + (V.wxi || 0) * (V.wx === 'dust' ? 1.4 : V.wx === 'mist' ? 1.1 : V.wx === 'rain' ? 0.5 : 0));
        scene.background = new THREE.Color(SK.hor);
        scene.fog = new THREE.FogExp2(SK.fog, FOG0);

        const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.3, 2400);
        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', precision: 'highp' });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setSize(innerWidth, innerHeight);
        let pixelRatio = Math.min(devicePixelRatio || 1, isTouch ? 1.75 : 2.25);
        renderer.setPixelRatio(pixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = isTouch ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
        $('canvas-container').appendChild(renderer.domElement);

        scene.add(new THREE.HemisphereLight(SK.hs[0], SK.hs[1], SK.hs[2]));
        const sun = new THREE.DirectionalLight(SK.sun, SK.si);
        sun.castShadow = true;
        const SM = isTouch ? 1536 : 2048;
        sun.shadow.mapSize.set(SM, SM);
        sun.shadow.camera.near = 1; sun.shadow.camera.far = 260;
        const SD = 45;
        sun.shadow.camera.left = -SD; sun.shadow.camera.right = SD; sun.shadow.camera.top = SD; sun.shadow.camera.bottom = -SD;
        scene.add(sun); scene.add(sun.target);

        const rand = (a, b) => a + Math.random() * (b - a);
        const pick = arr => arr[Math.floor(Math.random() * arr.length)];
        const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
        const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };

        function textTexture(text, w, h, bg, fg, size) {
            const c = document.createElement('canvas'); c.width = w; c.height = h;
            const g = c.getContext('2d');
            g.fillStyle = bg; g.fillRect(0, 0, w, h);
            g.strokeStyle = fg; g.lineWidth = 8; g.strokeRect(5, 5, w - 10, h - 10);
            let fs = size || 60;
            g.font = 'bold ' + fs + 'px Arial';
            while (g.measureText(text).width > w - 40 && fs > 14) { fs -= 2; g.font = 'bold ' + fs + 'px Arial'; }
            g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
            g.fillText(text, w / 2, h / 2 + 3);
            const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
        }
        function signMesh(text, w, h, bg, fg) {
            return new THREE.Mesh(new THREE.PlaneGeometry(w, h),
                new THREE.MeshBasicMaterial({ map: textTexture(text, 512, Math.max(64, Math.round(512 * h / w)), bg, fg) }));
        }

        // ============================================================
        // 4. ENVIRONMENT
        // ============================================================
        const AM = V.amb || [1, 1, 1, 0];
        const ROAD_LEN = (START_Z - END_Z) + 180, ROAD_CZ = (START_Z + END_Z) / 2;

        // ---- sky dome with gradient + sun disc ----
        const skyDome = (function () {
            const g = new THREE.SphereGeometry(900, 20, 14);
            const pos = g.attributes.position, n = pos.count, cols = new Float32Array(n * 3);
            const top = new THREE.Color(SK.top), hor = new THREE.Color(SK.hor), c = new THREE.Color();
            for (let i = 0; i < n; i++) {
                const t = Math.pow(clamp(pos.getY(i) / 900, 0, 1), 0.55);
                c.copy(hor).lerp(top, t); cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
            }
            g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
            const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }));
            m.renderOrder = -10; m.frustumCulled = false; scene.add(m); return m;
        })();
        const sunDir = new THREE.Vector3(SK.sd[0], SK.sd[1], SK.sd[2]).normalize();
        const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(46, 24),
            new THREE.MeshBasicMaterial({ color: SK.sun, fog: false, transparent: true, depthWrite: false,
                opacity: (V.sk === 'overcast' || V.sk === 'storm' || V.sk === 'mist') ? 0.1 : (V.sk === 'haze' || V.sk === 'sand') ? 0.55 : 0.95 }));
        sunDisc.renderOrder = -9; sunDisc.frustumCulled = false; scene.add(sunDisc);

        // ---- ground ----
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, ROAD_LEN), new THREE.MeshLambertMaterial({ color: V.gr }));
        ground.rotation.x = -Math.PI / 2; ground.position.set(0, 0, ROAD_CZ); ground.receiveShadow = true;
        scene.add(ground);
        if (V.gr2) {
            const N = 110, im = new THREE.InstancedMesh(new THREE.CircleGeometry(1, 12), new THREE.MeshLambertMaterial(), N);
            const o = new THREE.Object3D(), col = new THREE.Color(), a = new THREE.Color(V.gr2), b = new THREE.Color(V.gr);
            for (let i = 0; i < N; i++) {
                const r = rand(10, 46);
                o.position.set((Math.random() < 0.5 ? -1 : 1) * rand(48, 300), 0.04, rand(80, END_Z - 70));
                o.rotation.set(-Math.PI / 2, 0, 0); o.scale.set(r, r * rand(0.5, 1), 1); o.updateMatrix();
                im.setMatrixAt(i, o.matrix); im.setColorAt(i, col.copy(a).lerp(b, rand(0, 0.5)));
            }
            im.frustumCulled = false; im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
            scene.add(im);
        }

        // ---- road surface (texture differs per state) ----
        function roadTexture(type, baseHex) {
            const c = document.createElement('canvas'); c.width = c.height = 256;
            const g = c.getContext('2d');
            const rgb = h => [(h >> 16) & 255, (h >> 8) & 255, h & 255];
            const shade = (h, d) => 'rgb(' + rgb(h).map(v => clamp(Math.round(v + d), 0, 255)).join(',') + ')';
            const speck = (n, a, col) => { for (let i = 0; i < n; i++) { g.globalAlpha = a * Math.random(); g.fillStyle = col; g.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 2, 1 + Math.random() * 2); } g.globalAlpha = 1; };
            let rx = 1, ry = ROAD_LEN / 34;
            g.fillStyle = shade(baseHex, 0); g.fillRect(0, 0, 256, 256);
            if (type === 'laterite' || type === 'sand') {
                speck(1500, 0.35, '#000000'); speck(900, 0.3, '#ffffff');
                g.fillStyle = 'rgba(0,0,0,0.16)';
                [0.162, 0.368, 0.632, 0.838].forEach(u => g.fillRect(u * 256 - 9, 0, 18, 256));
            } else if (type === 'cobble' || type === 'brick') {
                rx = 6; ry = ROAD_LEN / (34 / 6);
                g.fillStyle = shade(baseHex, -55); g.fillRect(0, 0, 256, 256);
                const rows = 8, cols = 8, w = 256 / cols, h = 256 / rows;
                for (let r = 0; r < rows; r++) for (let k = -1; k < cols; k++) {
                    g.fillStyle = shade(baseHex, (Math.random() - 0.5) * 34);
                    g.fillRect(k * w + (r % 2) * w / 2 + 1.5, r * h + 1.5, w - 3, h - 3);
                }
            } else if (type === 'concrete') {
                rx = 2; ry = ROAD_LEN / 17;
                speck(900, 0.18, '#000000'); speck(500, 0.15, '#ffffff');
                g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(0, 0, 256, 3); g.fillRect(0, 128, 256, 3); g.fillRect(0, 0, 3, 256);
            } else {
                speck(1800, 0.3, '#000000'); speck(700, 0.2, '#ffffff');
            }
            const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 4; return t;
        }
        const roadTex = roadTexture(V.rd, V.rc);
        const roadMat = V.rd === 'wet'
            ? new THREE.MeshPhongMaterial({ map: roadTex, shininess: 90, specular: 0x556677, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 })
            : new THREE.MeshLambertMaterial({ map: roadTex, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
        const road = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_HALF * 2, ROAD_LEN), roadMat);
        road.rotation.x = -Math.PI / 2; road.position.set(0, 0.02, ROAD_CZ); road.receiveShadow = true;
        scene.add(road);

        function flatPlane(w, l, x, z, color) {
            const m = new THREE.Mesh(new THREE.PlaneGeometry(w, l),
                new THREE.MeshBasicMaterial({ color: color, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }));
            m.rotation.x = -Math.PI / 2; m.position.set(x, 0.04, z); scene.add(m); return m;
        }
        const MARKED = (V.rd === 'asphalt' || V.rd === 'wet' || V.rd === 'concrete');
        if (MARKED) {
            if (V.med) flatPlane(1.6, ROAD_LEN, 0, ROAD_CZ, V.med);
            else { flatPlane(0.22, ROAD_LEN, -0.28, ROAD_CZ, 0xf5b014); flatPlane(0.22, ROAD_LEN, 0.28, ROAD_CZ, 0xf5b014); }
            flatPlane(0.25, ROAD_LEN, -16, ROAD_CZ, 0xffffff);
            flatPlane(0.25, ROAD_LEN, 16, ROAD_CZ, 0xffffff);
            const zs = []; for (let z = 90; z > END_Z - 70; z -= 12) zs.push(z);
            const dash = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.22, 4.5),
                new THREE.MeshBasicMaterial({ color: 0xffffff, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }), zs.length * 2);
            const o = new THREE.Object3D(); let di = 0;
            zs.forEach(z => [-8, 8].forEach(x => { o.position.set(x, 0.04, z); o.rotation.set(-Math.PI / 2, 0, 0); o.updateMatrix(); dash.setMatrixAt(di++, o.matrix); }));
            dash.frustumCulled = false; scene.add(dash);
        } else if (V.med) flatPlane(1.4, ROAD_LEN, 0, ROAD_CZ, V.med);

        // ---- shoulders ----
        const SH_Y = (V.sh === 'walk' || V.sh === 'water') ? 0.3 : 0.12;
        [-1, 1].forEach(s => {
            if (V.sh === 'water') {
                const deck = new THREE.Mesh(new THREE.BoxGeometry(7, 0.3, ROAD_LEN), new THREE.MeshLambertMaterial({ color: V.shc }));
                deck.position.set(s * 21, 0.15, ROAD_CZ); deck.receiveShadow = true; scene.add(deck);
                const w = new THREE.Mesh(new THREE.PlaneGeometry(260, ROAD_LEN), new THREE.MeshPhongMaterial({ color: 0x2f7fa8, shininess: 80, specular: 0x88aabb }));
                w.rotation.x = -Math.PI / 2; w.position.set(s * (24.5 + 130), 0.06, ROAD_CZ); scene.add(w);
            } else {
                const h = SH_Y;
                const w = new THREE.Mesh(new THREE.BoxGeometry(14, h, ROAD_LEN), new THREE.MeshLambertMaterial({ color: V.shc }));
                w.position.set(s * 24, h / 2, ROAD_CZ); w.receiveShadow = true; scene.add(w);
            }
            if (V.sh === 'walk' || V.sh === 'cobble' || V.sh === 'water') {
                const k = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.36, ROAD_LEN), new THREE.MeshLambertMaterial({ color: 0xcfcfc8 }));
                k.position.set(s * 17.25, 0.18, ROAD_CZ); scene.add(k);
            }
        });
        if (V.far === 'river' || V.far === 'lagoon') {
            const w = new THREE.Mesh(new THREE.PlaneGeometry(700, ROAD_LEN), new THREE.MeshPhongMaterial({ color: V.farc, shininess: 70, specular: 0x99bbcc }));
            w.rotation.x = -Math.PI / 2; w.position.set(-490, 0.05, ROAD_CZ); scene.add(w);
        }

        // ---- instanced scenery pools ----
        const POOL = { box: [], cyl: [], cone: [], dome: [], roof: [], fcone: [], fdome: [] };
        const SG = {
            box: new THREE.BoxGeometry(1, 1, 1),
            cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 10),
            cone: new THREE.ConeGeometry(0.5, 1, 10),
            dome: new THREE.SphereGeometry(0.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 2, 1),
            roof: (function () {
                const P = [[-.5, 0, .5], [.5, 0, .5], [0, 1, .5], [.5, 0, -.5], [-.5, 0, -.5], [0, 1, -.5],
                           [-.5, 0, .5], [0, 1, .5], [0, 1, -.5], [-.5, 0, .5], [0, 1, -.5], [-.5, 0, -.5],
                           [.5, 0, .5], [.5, 0, -.5], [0, 1, -.5], [.5, 0, .5], [0, 1, -.5], [0, 1, .5]];
                const arr = new Float32Array(P.length * 3); P.forEach((p, i) => { arr[i * 3] = p[0]; arr[i * 3 + 1] = p[1]; arr[i * 3 + 2] = p[2]; });
                const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(arr, 3)); g.computeVertexNormals(); return g;
            })()
        };
        SG.fcone = SG.cone; SG.fdome = SG.dome;
        let curS = 1, curZ = 0;
        const hasY = k => (k === 'dome' || k === 'roof' || k === 'fdome');
        function Pw(kind, x, y0, z, sx, sy, sz, col, ry) { POOL[kind].push(x, y0 + (hasY(kind) ? 0 : sy / 2), z, sx, sy, sz, col, ry || 0); }
        function Pp(kind, u, y0, v, sx, sy, sz, col, ry) { Pw(kind, curS * (32 + u), y0, curZ + v, sx, sy, sz, col, ry); }
        const bx = (u, y, v, sx, sy, sz, c) => Pp('box', u, y, v, sx, sy, sz, c);
        const cy = (u, y, v, d, h, c) => Pp('cyl', u, y, v, d, h, d, c);
        const cn = (u, y, v, d, h, c) => Pp('cone', u, y, v, d, h, d, c);
        const dm = (u, y, v, d, h, c) => Pp('dome', u, y, v, d, h, d, c);
        const rf = (u, y, v, du, h, dv, c, alongX) => alongX ? Pp('roof', u, y, v, dv, h, du, c, Math.PI / 2) : Pp('roof', u, y, v, du, h, dv, c, 0);
        const pal = V.pal || [0xbfb09c, 0xa3b899, 0xc28282, 0x8e9aaf, 0xd4a373, 0xe6d8b8];
        const pc = () => pick(pal);
        const AWN = [0x00e5ff, 0xe74c3c, 0x27ae60, 0x2980b9, 0xf1c40f, 0x8e44ad];

        const ARC = {
            lowblock() { const h = rand(8, 15); bx(6, 0, 0, 12, h, 18, pc()); bx(6, h, 0, 12.8, 0.5, 18.8, 0x444444); bx(-1.4, 3.9, 0, 3, 0.4, 14, pick(AWN)); bx(-0.05, 0, 0, 0.3, 3.4, 14, 0x20242b); },
            highrise() { const h = rand(26, 64), w = rand(10, 13), l = rand(13, 16); bx(w / 2, 0, 0, w, h, l, pick([0x6fa3c8, 0x5b8fb0, 0x8fb8d0, 0x4f7a9a, 0xa8c0d0])); for (let y = 4; y < h - 2; y += 3.8) bx(w / 2, y, 0, w + 0.3, 0.55, l + 0.3, 0x1c2a38); bx(w / 2, h, 0, w * 0.6, 3, l * 0.6, 0x445566); if (Math.random() < 0.5) cy(w / 2, h + 3, 0, 0.5, 9, 0xcccccc); bx(5, 0, 0, 15, 3.5, l + 6, 0xd8d8d0); },
            colonial() { const rc = pick([0xa8442f, 0xb85a3a, 0x8f3a2a, 0x6b4a3a]); bx(5, 0, 0, 10, 6.5, 16, pc()); rf(5, 6.5, 0, 11, 2.8, 17, rc); [-6, -2, 2, 6].forEach(v => cy(-0.6, 0, v, 0.7, 6, 0xf5f2ea)); bx(-0.6, 6, 0, 2.4, 0.4, 15, 0xf5f2ea); bx(-0.05, 0, 0, 0.3, 3, 3, 0x3a2a1c); },
            mud() { const h = rand(7, 12), c = pc(); bx(5, 0, 0, 10, h, 15, c); for (let i = -3; i <= 3; i++) bx(0.5, h, i * 2.2, 0.9, 0.9, 0.9, c); cy(0.9, h, -6.5, 1.5, 1.6, c); cy(0.9, h, 6.5, 1.5, 1.6, c); bx(-0.05, 0, 0, 0.3, 3.2, 2.2, 0x3a2a1c); bx(-0.05, h * 0.6, -4, 0.3, 1.3, 1, 0x3a2a1c); bx(-0.05, h * 0.6, 4, 0.3, 1.3, 1, 0x3a2a1c); bx(-0.08, h - 1.4, 0, 0.3, 0.5, 15, 0xf2e6cf); if (Math.random() < 0.3) bx(11, 0, 0, 6, h + 4, 6, c); },
            mosque() { bx(5, 0, 0, 11, 8, 14, 0xf4f1e8); dm(5, 8, 0, 9, 5, pick([0x2e8b57, 0xf4f1e8, 0xd4b44a])); cy(0.8, 0, -7.8, 2, 17, 0xf4f1e8); cy(0.8, 17, -7.8, 2.8, 0.6, 0xf4f1e8); cn(0.8, 17.6, -7.8, 2.2, 3, 0x2e8b57); cy(0.8, 0, 7.8, 2, 15, 0xf4f1e8); cn(0.8, 15, 7.8, 2.2, 3, 0x2e8b57); bx(-0.05, 0, 0, 0.3, 4, 4, 0x2b4a3a); },
            stilt() { const c = pick([0x8a6a45, 0x6a8a9a, 0xa08a60, 0x7a8a6a, 0xb8a078]); [[1, -3], [1, 3], [7, -3], [7, 3]].forEach(a => cy(a[0], 0, a[1], 0.35, 3.2, 0x5a3a1a)); bx(4, 3.2, 0, 8, 0.3, 8, 0x6a4a2a); bx(4, 3.5, 0, 7, 2.8, 7, c); rf(4, 6.3, 0, 8.2, 2.3, 8.4, pick([0x7f8c8d, 0x8a5a3a])); bx(-1, 2.2, 0, 4, 0.2, 1.4, 0x6a4a2a); },
            timber() { bx(5, 0, 0, 9, 5, 12, pc()); rf(5, 5, 0, 10.4, 3.2, 13.4, pick([0x6b3a2a, 0x4a5a3a, 0x7a3a2a]), true); cy(-0.6, 0, -4, 0.4, 4.5, 0x5a3a1a); cy(-0.6, 0, 4, 0.4, 4.5, 0x5a3a1a); bx(-0.6, 4.5, 0, 2, 0.3, 10, 0x5a3a1a); },
            palace() { const w = pick([0xa8583f, 0xb8664a, 0x98503a]); bx(2, 0, 0, 3, 5.5, 24, w); for (let v = -10; v <= 10; v += 4) bx(2, 5.5, v, 1.2, 0.9, 1.6, w); if (Math.random() < 0.35) { bx(5, 0, 0, 7, 11, 9, w); cn(5, 11, 0, 9, 4.5, 0x7a3a2a); bx(1.4, 0, 0, 0.3, 4.5, 3, 0x2a1a10); } else { bx(9, 0, 0, 8, 7, 13, 0xc8a888); rf(9, 7, 0, 9, 3, 14, 0x8a3a2a); } },
            compound() { const rust = pick([0x8a4a2a, 0x9a5a34, 0x7a3f26]); bx(0.6, 0, 0, 0.5, 2.4, 18, 0xcdb99a); bx(4.5, 0, -3, 7, 4.3, 10, pc()); rf(4.5, 4.3, -3, 8, 1.6, 11, rust); bx(9.5, 0, 5, 5, 3.4, 7, pc()); rf(9.5, 3.4, 5, 6, 1.3, 8, rust); },
            market() { bx(9, 0, 0, 10, 6, 18, pc()); bx(9, 6, 0, 10.8, 0.5, 18.8, 0x555555); for (let i = 0; i < 5; i++) { const v = -7.2 + i * 3.6; bx(1.2, 0, v, 2.2, 2.6, 2.8, pick(AWN)); bx(0.6, 2.6, v, 3.4, 0.2, 3.4, pick(AWN)); } cy(-0.8, 0, -8, 0.2, 6, 0x555555); },
            hillhouse() { bx(5, 0, 0, 10, 1.4, 18, 0x8a8478); [[3, -5.5], [4.5, 0], [3, 5.5]].forEach(a => { bx(a[0], 1.4, a[1], 3.6, 2.6, 3.8, pc()); rf(a[0], 4, a[1], 4.2, 1.6, 4.4, pick([0x8a3a2a, 0x6a4a3a, 0x4a5a6a])); }); dm(9, 1.4, -3, 4.5, 2.2, 0x9a948a); },
            oil() { cy(5, 0, -5, 6.5, 7, 0xd8dadc); cy(5, 0, 5, 6.5, 5, 0xe8e8e8); cy(5, 2.6, 5, 6.6, 0.7, 0xc0392b); bx(1.2, 0, 0, 0.6, 0.6, 18, 0x666a70); [-8, 0, 8].forEach(v => bx(1.2, 0, v, 0.5, 2.2, 0.5, 0x666a70)); bx(11, 0, 0, 5, 4, 9, 0xc8c4b8); },
            hut() { const m = pc(), th = pick([0xc9a24a, 0xb8903a, 0x9a7a30]); cy(5, 0, -2, 5, 2.6, m); cn(5, 2.6, -2, 6.6, 2.8, th); cy(8.5, 0, 4.5, 3, 2.2, m); cn(8.5, 2.2, 4.5, 4, 2.4, th); bx(0.6, 0, 0, 0.3, 1.4, 12, 0x8a6a3a); },
            civic() { const h = rand(10, 18), c = pick([0xf0eee6, 0xe8e0d0, 0xdad8cc]); bx(8, 0, 0, 14, h, 20, c); bx(0.2, 3, 0, 0.3, rand(3, 6), 18, 0x7fd8e8); for (let v = -8; v <= 8; v += 4) cy(-0.6, 0, v, 0.9, h * 0.6, 0xffffff); bx(8, h, 0, 14.8, 0.8, 20.8, pick([0x2e8b57, 0x00a8cc, 0xd4b44a])); if (Math.random() < 0.25) bx(10, h, 0, 6, 9, 6, c); },
            tin() { bx(5, 0, 0, 8, 3.2, 10, 0x8f8a80); rf(5, 3.2, 0, 9, 4.2, 11, pick([0x3b6ea5, 0xb33939, 0x2e8b57, 0x8a4a2a]), true); cy(7, 3.2, -3, 0.8, 5, 0x6a6a68); bx(9.5, 0, 5, 4, 2.8, 5, 0x8f8a80); rf(9.5, 2.8, 5, 5, 2, 6, pick([0x3b6ea5, 0xb33939])); },
            silo() { [-6, 0, 6].forEach(v => { cy(6, 0, v, 5, 12, 0xd8d8d0); cn(6, 12, v, 5.2, 2, 0x9a9a92); }); bx(1.5, 0, 0, 3, 4, 18, 0xb8b0a0); bx(11, 0, 0, 6, 6, 16, 0xc8c0b0); },
            shrine() { const t = rand(8, 13); cy(6, 0, -3, 1.6, t, 0x4a3a28); dm(6, t - 1, -3, 12, 6, 0x2f6a35); dm(7, t - 3, 2, 9, 4.5, 0x3f7a40); cn(1.5, 0, 3, 3.4, 2.4, 0xc9a24a); cy(1.5, 0, 3, 2.4, 1.4, 0xe8dcc0); cy(3, 0, -6, 0.4, 5, 0xd4b44a); dm(3, 5, -6, 1.6, 1.8, 0xd4b44a); bx(0.4, 2.5, -3, 0.1, 0.8, 2.5, 0xffffff); },
            dry() { [-7, -2, 3, 8].forEach(v => cy(2, 0, v, 0.25, 3, 0x5a3a1a)); bx(2, 3, 0, 0.25, 0.25, 17, 0x5a3a1a); for (let i = 0; i < 8; i++) bx(2, 1.7, -7 + i * 2, 0.3, 1.2, 0.35, pick([0x9aa8a8, 0x7a8a90, 0xb8b0a0])); cn(7, 0, -2, 5, 2.4, 0xc9a24a); cy(7, 0, -2, 4, 2.4, pc()); },
            farm() { bx(8, 0, 0, 10, 5, 12, 0xa84a3a); rf(8, 5, 0, 11, 3.5, 13, 0x6a2a1e, true); cy(2.5, 0, 7, 4, 9, 0xd8d8d0); dm(2.5, 9, 7, 4, 2.5, 0x9a9a92); for (let i = 0; i < 4; i++) dm(14, 0, -6 + i * 4, 3, 2.4, 0xc9a24a); }
        };
        function wlist(arr) { const out = []; (arr || []).forEach(s => { const p = s.split(':'), w = p.length > 1 ? parseInt(p[1], 10) : 1; for (let i = 0; i < w; i++) out.push(p[0]); }); return out; }

        (function genBuildings() {
            const list = wlist(V.bl), dens = V.dens || 0.92;
            for (let z = 80; z > END_Z - 70; z -= 24) [-1, 1].forEach(s => {
                curS = s; curZ = z;
                if (Math.random() > dens) return;
                (ARC[pick(list)] || ARC.lowblock)();
            });
        })();

        const PROPF = {
            palm(x, z) { const h = rand(7, 11); Pw('cyl', x, 0, z, 0.5, h, 0.5, 0x7a5a3a); Pw('dome', x, h - 0.2, z, 6.2, 2.4, 6.2, 0x3f8a3a); Pw('dome', x, h - 0.9, z, 4, 1.6, 4, 0x2f7030); },
            shade(x, z) { const h = rand(3, 5); Pw('cyl', x, 0, z, 0.7, h, 0.7, 0x5a3f26); Pw('dome', x, h - 0.5, z, rand(6, 9), rand(4, 6), rand(6, 9), pick([0x3a7a3a, 0x4a8a3a, 0x2f6a35])); },
            baobab(x, z) { Pw('cyl', x, 0, z, 3.2, 7, 3.2, 0x8a7a68); [[-1.6, 0], [1.6, 0.5], [0, -1.4]].forEach(a => Pw('dome', x + a[0], 6.4, z + a[1], 4.5, 2.6, 4.5, 0x5a7a3a)); },
            pine(x, z) { const h = rand(9, 14); Pw('cyl', x, 0, z, 0.5, h * 0.35, 0.5, 0x5a3f26); for (let i = 0; i < 4; i++) Pw('cone', x, h * 0.2 + i * h * 0.17, z, 5 - i * 1.1, h * 0.32, 5 - i * 1.1, 0x2f5f3a); },
            acacia(x, z) { const h = rand(4, 6); Pw('cyl', x, 0, z, 0.45, h, 0.45, 0x6a4a2a); Pw('cyl', x, h, z, rand(6, 9), 0.7, rand(6, 9), 0x6a8a3a); },
            shrub(x, z) { Pw('dome', x, 0, z, rand(1.6, 3), rand(1, 2), rand(1.6, 3), pick([0x4a7a3a, 0x5a8a3a, 0x6a8a4a])); },
            rock(x, z) { const d = rand(3, 8); Pw('dome', x, 0, z, d, d * rand(0.4, 0.8), d * rand(0.7, 1.1), pick([0x8a867c, 0x7a766c, 0x9a948a])); Pw('dome', x + d * 0.4, 0, z + d * 0.3, d * 0.6, d * 0.4, d * 0.6, 0x8a867c); },
            mangrove(x, z) { Pw('dome', x, 0.5, z, rand(3, 5), rand(2, 3), rand(3, 5), 0x2f5a35); for (let i = 0; i < 4; i++) Pw('cyl', x + (i - 1.5) * 0.7, 0, z, 0.18, 1.6, 0.18, 0x4a3a28); },
            termite(x, z) { Pw('cone', x, 0, z, rand(1.6, 2.6), rand(2, 3.4), rand(1.6, 2.6), 0xb88a5a); }
        };
        (function genProps() {
            const road = wlist(V.tr || ['shade:1']), back = wlist(V.bk || V.tr || ['shade:1']);
            const nearStop = z => STOPS.some(s => Math.abs(s - z) < 14);
            if (V.sh !== 'water') for (let z = 70; z > END_Z - 70; z -= 18) [-1, 1].forEach(s => {
                if (Math.random() > 0.7 || (s > 0 && nearStop(z))) return;
                (PROPF[pick(road)] || PROPF.shade)(s * rand(26.5, 30), z + rand(-4, 4));
            });
            const N = Math.round(300 * (V.dens || 0.92));
            for (let i = 0; i < N; i++) (PROPF[pick(back)] || PROPF.shade)((Math.random() < 0.5 ? -1 : 1) * rand(47, 170), rand(80, END_Z - 70));
            // wooden or steel lamp poles
            const lamp = V.sh === 'walk' ? 'steel' : (V.sh === 'water' ? null : 'wood');
            for (let z = 70; z > END_Z - 70; z -= (lamp === 'steel' ? 45 : 70)) [-1, 1].forEach(s => {
                if (lamp === 'steel') { Pw('cyl', s * 19.2, 0, z, 0.22, 8, 0.22, 0x555a60); Pw('box', s * 18.4, 8, z, 1.4, 0.2, 0.5, 0xfff2c0); }
                else if (lamp === 'wood') { Pw('cyl', s * 19.2, 0, z, 0.3, 7.5, 0.3, 0x6a4a2a); Pw('box', s * 19.2, 7, z, 0.15, 0.15, 2.4, 0x5a3f26); }
            });
            if (V.fld) for (let i = 0; i < 130; i++) Pw('box', (Math.random() < 0.5 ? -1 : 1) * rand(52, 150), 0, rand(60, END_Z - 70), rand(18, 42), 0.14, rand(14, 30), pick(V.fld));
            // far backdrop
            if (V.far === 'hills' || V.far === 'rock') for (let z = 100; z > END_Z - 70; z -= 70) [-1, 1].forEach(s => {
                const d = rand(180, 320), h = rand(35, V.far === 'rock' ? 130 : 95);
                const c = new THREE.Color(V.farc).lerp(new THREE.Color(SK.fog), rand(0.05, 0.4)).getHex();
                if (V.far === 'rock' && Math.random() < 0.45) Pw('fdome', s * rand(260, 520), 0, z, d, h * 0.9, d * 0.8, 0x7a7468 + (Math.random() < 0.5 ? 0x080808 : 0));
                else Pw('fcone', s * rand(260, 560), 0, z, d, h, d, c);
            });
            else if (V.far === 'dunes') for (let z = 100; z > END_Z - 70; z -= 55) [-1, 1].forEach(s => {
                Pw('fdome', s * rand(120, 520), 0, z, rand(220, 380), rand(12, 36), rand(160, 260), new THREE.Color(V.farc).lerp(new THREE.Color(SK.fog), rand(0, 0.3)).getHex());
            });
        })();

        // landmarks (single meshes, each with a name board)
        const flames = [];
        function buildLandmark(kind, x, z, label) {
            const g = new THREE.Group(), L = c => new THREE.MeshLambertMaterial({ color: c });
            const add = (geo, c, px, py, pz) => { const m = new THREE.Mesh(geo, L(c)); m.position.set(px, py, pz); g.add(m); return m; };
            const B = (w, h, l) => new THREE.BoxGeometry(w, h, l), C = (r1, r2, h, n) => new THREE.CylinderGeometry(r1, r2, h, n || 14), D = (r, hh) => new THREE.SphereGeometry(r, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, hh / r, 1);
            let top = 40;
            switch (kind) {
                case 'rock': add(D(55, 60), 0x8a8478, 0, 0, 0); add(D(34, 38), 0x7a766c, 40, 0, 20); top = 70; break;
                case 'zuma': add(D(85, 130), 0x6a6460, 0, 0, 0); add(D(40, 60), 0x7a746c, 70, 0, 20); top = 140; break;
                case 'hill': add(new THREE.ConeGeometry(110, 70, 14), 0x5a7a4a, 0, 35, 0); add(new THREE.ConeGeometry(70, 50, 12), 0x6a8a5a, 70, 25, 15); top = 78; break;
                case 'tower': add(B(16, 70, 16), 0x9ab8d0, 0, 35, 0); add(B(17, 4, 17), 0x2c3e50, 0, 72, 0); add(C(0.5, 0.5, 14, 6), 0xcccccc, 0, 81, 0); top = 90; break;
                case 'cocoa': add(B(14, 58, 14), 0xe8dcc0, 0, 29, 0); add(B(19, 6, 19), 0x7a4a2a, 0, 61, 0); add(C(0.5, 0.5, 12, 6), 0xcccccc, 0, 70, 0); top = 78; break;
                case 'palace': add(B(40, 14, 30), 0xa8583f, 0, 7, 0); add(new THREE.ConeGeometry(8, 26, 12), 0x7a3a2a, 0, 27, 0); [-18, 18].forEach(px => add(C(3, 3.4, 22, 12), 0xa8583f, px, 11, 0)); top = 44; break;
                case 'flare': add(C(0.9, 1.4, 55, 8), 0x888c90, 0, 27, 0); { const f = add(new THREE.ConeGeometry(2.2, 8, 8), 0xff7a1a, 0, 59, 0); f.material = new THREE.MeshBasicMaterial({ color: 0xff8a1f, fog: false }); flames.push(f); } [-14, 14].forEach(px => add(C(8, 8, 14, 16), 0xd8dadc, px, 7, 18)); top = 70; break;
                case 'minaret': [-24, 24].forEach(px => { add(C(1.6, 2, 50, 12), 0xf4f1e8, px, 25, 0); add(new THREE.ConeGeometry(2.4, 5, 10), 0x2e8b57, px, 52, 0); }); add(D(18, 22), 0xf4f1e8, 0, 8, 0); add(B(40, 8, 30), 0xf4f1e8, 0, 4, 0); top = 62; break;
                case 'dome': add(B(36, 10, 36), 0xe8dcc0, 0, 5, 0); add(D(20, 24), pick([0xd4b44a, 0x2e8b57, 0xe8e0d0]), 0, 10, 0); top = 40; break;
                case 'bridgearch': { const t = new THREE.Mesh(new THREE.TorusGeometry(40, 1.8, 8, 28, Math.PI), L(0xc8c8c0)); t.rotation.y = Math.PI / 2; g.add(t); [-30, -15, 15, 30].forEach(pz => add(C(0.25, 0.25, 30, 4), 0xa8a8a0, 0, 14, pz)); add(B(6, 2, 100), 0x777777, 0, 1, 0); top = 46; break; }
                case 'lighthouse': add(C(3, 4.6, 24, 14), 0xf4f1e8, 0, 12, 0); add(C(2.9, 3.4, 8, 14), 0xc0392b, 0, 20, 0); add(C(3.4, 3.4, 2, 14), 0x333333, 0, 25, 0); add(D(2.6, 3), 0xfff2a0, 0, 26, 0); top = 32; break;
                case 'stadium': add(C(40, 36, 14, 28), 0xe8e8e0, 0, 7, 0); add(C(34, 34, 14.4, 28), 0x3a7a3a, 0, 7.4, 0); top = 20; break;
                case 'obelisk': add(C(1.2, 4, 60, 4), 0xe8e0d0, 0, 30, 0); add(new THREE.ConeGeometry(1.6, 6, 4), 0xd4b44a, 0, 63, 0); top = 70; break;
                case 'tank': [-18, 0, 18].forEach(pz => { add(C(10, 10, 20, 18), 0xd8dadc, 0, 10, pz); add(C(10.2, 10.2, 2, 18), 0xc0392b, 0, 14, pz); }); top = 26; break;
                case 'rig': [[-9, -9], [9, -9], [-9, 9], [9, 9]].forEach(a => add(C(0.9, 0.9, 40, 6), 0x777a7e, a[0], 20, a[1])); add(B(26, 3, 26), 0x666a70, 0, 40, 0); add(new THREE.ConeGeometry(5, 26, 4), 0x888c90, 0, 55, 0); top = 72; break;
                case 'grove': [[0, 0, 30], [-26, 10, 22], [24, -10, 26]].forEach(a => { add(C(2, 3, 20, 8), 0x4a3a28, a[0], 10, a[1]); add(D(a[2], a[2] * 0.8), 0x2f6a35, a[0], 18, a[1]); }); top = 48; break;
                default: add(new THREE.ConeGeometry(90, 55, 12), 0x5a7a4a, 0, 27, 0); top = 60;
            }
            g.position.set(x, 0, z);
            const sg = signMesh(label, 22, 3.6, '#001a1f', '#00e5ff'); sg.position.set(x > 0 ? x - 30 : x + 30, Math.max(14, Math.min(top * 0.55, 30)), z + 40);
            sg.rotation.y = (x > 0 ? -1 : 1) * (Math.PI / 2 - 0.45);
            scene.add(g); scene.add(sg);
        }
        (V.lm || []).forEach((k, i) => buildLandmark(k, (i % 2 ? -1 : 1) * rand(105, 135), -300 - i * 700, (V.lmn && V.lmn[i]) || NGS.city.toUpperCase()));

        function flushPool(kind, shadow) {
            const a = POOL[kind], n = a.length / 8; if (!n) return;
            const im = new THREE.InstancedMesh(SG[kind], new THREE.MeshLambertMaterial(), n);
            const o = new THREE.Object3D(), col = new THREE.Color();
            for (let i = 0; i < n; i++) {
                const k = i * 8;
                o.position.set(a[k], a[k + 1], a[k + 2]); o.rotation.set(0, a[k + 7], 0); o.scale.set(a[k + 3], a[k + 4], a[k + 5]); o.updateMatrix();
                im.setMatrixAt(i, o.matrix); im.setColorAt(i, col.setHex(a[k + 6]));
            }
            im.frustumCulled = false; im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
            if (shadow) { im.castShadow = true; im.receiveShadow = true; }
            scene.add(im);
        }
        ['box', 'cyl', 'cone', 'dome', 'roof'].forEach(k => flushPool(k, true));
        ['fcone', 'fdome'].forEach(k => flushPool(k, false));

        // ---- weather: rain streaks and drifting dust ----
        const WX = { rain: null, dust: null, N: 0 };
        (function () {
            const wi = V.wxi == null ? 0.5 : V.wxi;
            if (V.wx === 'rain') {
                const N = Math.round(900 * wi) + 200; WX.N = N;
                const g = new THREE.BufferGeometry(), pos = new Float32Array(N * 6), off = new Float32Array(N * 3);
                for (let i = 0; i < N; i++) { off[i * 3] = rand(-45, 45); off[i * 3 + 1] = rand(0, 32); off[i * 3 + 2] = rand(-70, 15); }
                g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.userData.off = off;
                WX.rain = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xcfe3ef, transparent: true, opacity: 0.4 }));
                WX.rain.frustumCulled = false; scene.add(WX.rain);
            } else if (V.wx === 'dust') {
                const N = Math.round(260 * (0.4 + wi)); WX.N = N;
                const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
                const gr = x.createRadialGradient(32, 32, 2, 32, 32, 30); gr.addColorStop(0, 'rgba(255,240,200,0.9)'); gr.addColorStop(1, 'rgba(255,240,200,0)');
                x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
                const g = new THREE.BufferGeometry(), pos = new Float32Array(N * 3), off = new Float32Array(N * 3);
                for (let i = 0; i < N; i++) { off[i * 3] = rand(-50, 50); off[i * 3 + 1] = rand(0.5, 14); off[i * 3 + 2] = rand(-90, 20); }
                g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.userData.off = off;
                WX.dust = new THREE.Points(g, new THREE.PointsMaterial({ size: 9, map: new THREE.CanvasTexture(c), transparent: true, opacity: 0.35 + 0.3 * wi, depthWrite: false, color: 0xd8c08a }));
                WX.dust.frustumCulled = false; scene.add(WX.dust);
            }
        })();
        function updateWeather(dt) {
            const cp = camera.position;
            if (WX.rain) {
                const g = WX.rain.geometry, pos = g.attributes.position.array, off = g.userData.off;
                for (let i = 0; i < WX.N; i++) {
                    off[i * 3 + 1] -= 38 * dt; off[i * 3] -= 4 * dt;
                    if (off[i * 3 + 1] < 0) { off[i * 3 + 1] = 32; off[i * 3] = rand(-45, 45); off[i * 3 + 2] = rand(-70, 15); }
                    const x = cp.x + off[i * 3], y = off[i * 3 + 1], z = cp.z + off[i * 3 + 2];
                    pos[i * 6] = x; pos[i * 6 + 1] = y; pos[i * 6 + 2] = z; pos[i * 6 + 3] = x - 0.12; pos[i * 6 + 4] = y - 1.3; pos[i * 6 + 5] = z;
                }
                g.attributes.position.needsUpdate = true;
            }
            if (WX.dust) {
                const g = WX.dust.geometry, pos = g.attributes.position.array, off = g.userData.off;
                for (let i = 0; i < WX.N; i++) {
                    off[i * 3] += 9 * dt;
                    if (off[i * 3] > 50) off[i * 3] = -50;
                    pos[i * 3] = cp.x + off[i * 3]; pos[i * 3 + 1] = off[i * 3 + 1]; pos[i * 3 + 2] = cp.z + off[i * 3 + 2];
                }
                g.attributes.position.needsUpdate = true;
            }
        }

        (function () {
            const msgs = ['LEARN WEB3 WITH T3KIT', 'NEVER SHARE YOUR SEED PHRASE', NGS.sign, 'VERIFY BEFORE YOU SIGN',
                          'YOUR KEYS, YOUR COINS', 'NO "DOUBLE YOUR MONEY" GIVEAWAYS', 'KITCITY: ONBOARD NIGERIA', 'STAY SAFE ON-CHAIN'];
            msgs.forEach((m, i) => {
                const z = -110 - i * 205;
                const s = signMesh(m, 10, 2.8, '#001a1f', '#00e5ff'); s.position.set(-21.5, 8, z); scene.add(s);
                const p = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 7, 8), new THREE.MeshLambertMaterial({ color: 0x444444 }));
                p.position.set(-21.5, 3.5, z); scene.add(p);
            });
        })();

        function buildStop(z, name) {
            const g = new THREE.Group();
            const poleM = new THREE.MeshStandardMaterial({ color: 0x555555 });
            [[-3, -2.2], [-3, 2.2], [3, -2.2], [3, 2.2]].forEach(([dx, dz]) => {
                const p = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.6, 8), poleM);
                p.position.set(dx, 1.8, dz); g.add(p);
            });
            const roof = new THREE.Mesh(new THREE.BoxGeometry(7, 0.2, 5.4), new THREE.MeshStandardMaterial({ color: 0x00e5ff }));
            roof.position.set(0, 3.7, 0); roof.castShadow = true; g.add(roof);
            const back = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, 5), new THREE.MeshStandardMaterial({ color: 0x2c3e50 }));
            back.position.set(3, 1.5, 0); g.add(back);
            g.rotation.y = -Math.PI / 2;
            g.position.set(25.5, SH_Y, z);
            scene.add(g);
            const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 5, 8), poleM); sp.position.set(18.6, 2.5, z); scene.add(sp);
            const sign = signMesh(name, 5, 1.2, '#00e5ff', '#111111'); sign.position.set(18.6, 5.5, z); scene.add(sign);
        }
        PASSENGERS.forEach((p, i) => { p.z = STOPS[i]; buildStop(p.z, p.stop.toUpperCase()); });

        function gantry(z, text, bg, fg) {
            const m = new THREE.MeshStandardMaterial({ color: 0x333840 });
            [-1, 1].forEach(s => { const p = new THREE.Mesh(new THREE.BoxGeometry(1, 9, 1), m); p.position.set(s * 18.5, 4.5, z); scene.add(p); });
            const b = new THREE.Mesh(new THREE.BoxGeometry(38, 3.2, 1), m); b.position.set(0, 9.2, z); scene.add(b);
            const sgn = signMesh(text, 34, 2.6, bg, fg); sgn.position.set(0, 9.2, z + 0.55); scene.add(sgn);
        }
        gantry(0, NGS.city.toUpperCase() + '  >>  ' + NGS.term.toUpperCase(), '#00e5ff', '#111111');
        gantry(TERMINAL_Z + 760, 'KITCITY ARRIVAL · ' + NGS.city.toUpperCase(), '#07161c', '#00e5ff');
        const depot = new THREE.Mesh(new THREE.BoxGeometry(30, 9, 40), new THREE.MeshStandardMaterial({ color: 0xdcd6c8 }));
        depot.position.set(52, 4.5, TERMINAL_Z + 770); depot.castShadow = true; scene.add(depot);
        const endWall = new THREE.Mesh(new THREE.BoxGeometry(80, 5, 2), new THREE.MeshStandardMaterial({ color: 0xc0392b }));
        endWall.position.set(0, 2.5, END_Z - 6); scene.add(endWall);

        // ---- Final destination: T3kit, the KitCity hub for every city ----
        (function buildT3KitHub() {
            const z = TERMINAL_Z - 18, x = 43;
            const dark = new THREE.MeshStandardMaterial({ color: 0x07161c, roughness: 0.3, metalness: 0.35 });
            const cyan = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x003b45, roughness: 0.25, metalness: 0.35 });
            const glass = new THREE.MeshStandardMaterial({ color: 0x102f39, emissive: 0x001820, transparent: true, opacity: 0.9 });
            const white = new THREE.MeshStandardMaterial({ color: 0xeaf7f8, roughness: 0.45 });
            const red = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.5 });

            const base = new THREE.Mesh(new THREE.BoxGeometry(34, 12, 46), dark);
            base.position.set(x, 6, z); base.castShadow = true; base.receiveShadow = true; scene.add(base);

            const roof = new THREE.Mesh(new THREE.BoxGeometry(37, 1.2, 49), cyan);
            roof.position.set(x, 12.6, z); roof.castShadow = true; scene.add(roof);

            const crown = new THREE.Mesh(new THREE.BoxGeometry(22, 2.6, 6), dark);
            crown.position.set(x, 14.2, z - 4); scene.add(crown);

            // Road-facing glass entrance wall.
            const facade = new THREE.Mesh(new THREE.BoxGeometry(0.55, 8.4, 25), glass);
            facade.position.set(x - 17.25, 4.4, z); scene.add(facade);
            for (let zz = z - 9; zz <= z + 9; zz += 6) {
                const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.7, 8.8, 0.28), cyan);
                mullion.position.set(x - 17.65, 4.5, zz); scene.add(mullion);
            }

            // Main entrance canopy / arrival portico.
            const canopy = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.65, 13), cyan);
            canopy.position.set(x - 20.2, 8.2, z); canopy.castShadow = true; scene.add(canopy);
            [-5, 5].forEach(zz => {
                const col = new THREE.Mesh(new THREE.BoxGeometry(0.7, 7.6, 0.7), white);
                col.position.set(x - 20.4, 4, z + zz); scene.add(col);
            });
            const steps = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.35, 15), white);
            steps.position.set(x - 20.8, 0.18, z); scene.add(steps);

            // City-specific hero sign + brand tagline.
            const sign = signMesh('T3KIT', 18, 3.2, '#001a1f', '#00e5ff');
            sign.position.set(x - 17.75, 11.0, z - 1.5); sign.rotation.y = -Math.PI / 2; scene.add(sign);
            const tagline = signMesh('YOUR WEB3 JOURNEY, REIMAGINED', 15, 1.45, '#001a1f', '#ffffff');
            tagline.position.set(x - 17.82, 8.95, z - 1.5); tagline.rotation.y = -Math.PI / 2; scene.add(tagline);
            const citySign = signMesh(NGS.city.toUpperCase() + ' · KITCITY HUB', 15, 2.2, '#c0392b', '#ffffff');
            citySign.position.set(x - 18.0, 7.1, z + 1.5); citySign.rotation.y = -Math.PI / 2; scene.add(citySign);

            // Tall glowing hub beacon visible from the final approach.
            const beacon = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.8, 18, 16),
                new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00a9bd, emissiveIntensity: 1.2 }));
            beacon.position.set(x + 2, 18, z - 10); scene.add(beacon);
            const cap = new THREE.Mesh(new THREE.SphereGeometry(2.3, 16, 10),
                new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
            cap.position.set(x + 2, 27, z - 10); scene.add(cap);

            // Arrival forecourt and directional lights.
            const plaza = new THREE.Mesh(new THREE.BoxGeometry(30, 0.18, 42),
                new THREE.MeshStandardMaterial({ color: 0x25323a, roughness: 0.8 }));
            plaza.position.set(26, 0.09, z); scene.add(plaza);
            for (let zz = z - 15; zz <= z + 15; zz += 10) {
                const strip = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.35),
                    new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
                strip.position.set(17.5, 0.15, zz); scene.add(strip);
            }

            // Arrival gantry tells the player what this destination is.
            const gateMat = new THREE.MeshStandardMaterial({ color: 0x111c22 });
            [-1, 1].forEach(side => {
                const p = new THREE.Mesh(new THREE.BoxGeometry(1, 8, 1), gateMat);
                p.position.set(side * 18, 4, TERMINAL_Z - 62); scene.add(p);
            });
            const gate = new THREE.Mesh(new THREE.BoxGeometry(38, 2.4, 1), gateMat);
            gate.position.set(0, 8.3, TERMINAL_Z - 62); scene.add(gate);
            const gateSign = signMesh('ARRIVAL · KITCITY', 34, 2.4, '#001a1f', '#00e5ff');
            gateSign.position.set(0, 8.3, TERMINAL_Z - 61.35); scene.add(gateSign);
        })();

        // ============================================================
        // 5. DANFO
        // ============================================================
        const danfo = new THREE.Group();
        const rig = new THREE.Group();
        danfo.add(rig); scene.add(danfo);
        const glassMeshes = [];
        let tailMat, steerSpin;
        const wheels = [];

        (function buildDanfo() {
            const yellow = new THREE.MeshStandardMaterial({ color: 0xf5b014, roughness: 0.45, metalness: 0.15 });
            const black = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
            const glass = new THREE.MeshStandardMaterial({ color: 0x15202b, roughness: 0.1, metalness: 0.4, transparent: true, opacity: 0.9 });
            const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 7.4),
                new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending }));
            glow.rotation.x = -Math.PI / 2; glow.position.y = 0.1; danfo.add(glow);
            const add = (geo, mat, x, y, z, shadow) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if (shadow) m.castShadow = true; rig.add(m); return m; };

            add(new THREE.BoxGeometry(2.6, 2.3, 6.4), yellow, 0, 1.65, 0, true);
            add(new THREE.BoxGeometry(2.64, 0.32, 6.44), new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.55 }), 0, 1.05, 0);
            glassMeshes.push(add(new THREE.BoxGeometry(2.64, 0.75, 4.3), glass, 0, 2.25, 0.55));
            glassMeshes.push(add(new THREE.BoxGeometry(2.3, 0.85, 0.06), glass, 0, 2.2, -3.2));
            glassMeshes.push(add(new THREE.BoxGeometry(2.3, 0.8, 0.06), glass, 0, 2.2, 3.2));
            add(new THREE.BoxGeometry(2.7, 0.12, 6.5), yellow, 0, 2.84, 0);
            add(new THREE.BoxGeometry(2.2, 0.1, 4), black, 0, 3.0, 0.3);
            add(new THREE.BoxGeometry(2.7, 0.3, 0.25), black, 0, 0.75, -3.3);
            add(new THREE.BoxGeometry(2.7, 0.3, 0.25), black, 0, 0.75, 3.3);
            const rearPanel = add(new THREE.BoxGeometry(2.18, 0.46, 0.08), black, 0, 1.72, 3.31, true);
            const rearLblMat = new THREE.MeshBasicMaterial({ map: textTexture('T3kit', 768, 128, '#07161c', '#00e5ff', 82), transparent: false });
            const rearLbl = new THREE.Mesh(new THREE.PlaneGeometry(1.92, 0.32), rearLblMat);
            rearLbl.position.set(0, 1.72, 3.36); rearLbl.rotation.y = 0; rig.add(rearLbl);
            // Refined rear finish: dark lower valance, crisp lamps, and restrained cyan accent.
            add(new THREE.BoxGeometry(2.45, 0.09, 0.09), new THREE.MeshStandardMaterial({ color: 0x00e5ff, metalness: 0.35, roughness: 0.3, emissive: 0x00343a }), 0, 1.42, 3.36);
            add(new THREE.BoxGeometry(2.45, 0.12, 0.12), black, 0, 0.62, 3.34);

            const head = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffffaa, emissiveIntensity: 0.9 });
            tailMat = new THREE.MeshStandardMaterial({ color: 0x8a0000, emissive: 0xff0000, emissiveIntensity: 0.5 });
            [-0.9, 0.9].forEach(x => {
                add(new THREE.BoxGeometry(0.45, 0.3, 0.1), head, x, 1.15, -3.23);
                add(new THREE.BoxGeometry(0.45, 0.35, 0.1), tailMat, x * 1.05, 1.3, 3.23);
                add(new THREE.BoxGeometry(0.12, 0.35, 0.3), black, x * 1.7, 2.0, -2.4);
            });

            const lblMat = new THREE.MeshBasicMaterial({ map: textTexture('KITCITY  ·  ' + NGS.city.toUpperCase(), 1024, 128, '#07161c', '#00e5ff', 64) });
            const lr = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 0.55), lblMat); lr.position.set(1.33, 1.55, 0.2); lr.rotation.y = Math.PI / 2; rig.add(lr);
            const ll = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 0.55), lblMat); ll.position.set(-1.33, 1.55, 0.2); ll.rotation.y = -Math.PI / 2; rig.add(ll);

            add(new THREE.BoxGeometry(2.2, 0.5, 0.8), black, 0, 1.75, -2.75);
            const tilt = new THREE.Group(); tilt.position.set(-0.7, 2.0, -2.15); tilt.rotation.x = -0.8; rig.add(tilt);
            steerSpin = new THREE.Group(); tilt.add(steerSpin);
            const sm = new THREE.MeshStandardMaterial({ color: 0x222222 });
            steerSpin.add(new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 8, 24), sm));
            const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), sm); steerSpin.add(spoke);
            const spoke2 = spoke.clone(); spoke2.rotation.z = Math.PI / 2; steerSpin.add(spoke2);

            const wGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 20);
            const wMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.9 });
            const hGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.37, 12);
            const hMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, metalness: 0.6, roughness: 0.4 });
            [[-1.35, -2.1, true], [1.35, -2.1, true], [-1.35, 2.1, false], [1.35, 2.1, false]].forEach(([x, z, front]) => {
                const sg = new THREE.Group(); sg.position.set(x, 0.5, z);
                const roll = new THREE.Group();
                const w = new THREE.Mesh(wGeo, wMat); w.rotation.z = Math.PI / 2; w.castShadow = true; roll.add(w);
                const hub = new THREE.Mesh(hGeo, hMat); hub.rotation.z = Math.PI / 2; roll.add(hub);
                sg.add(roll); rig.add(sg);
                wheels.push({ sg, roll, front });
            });
        })();

        // ============================================================
        // 6. PASSENGERS & BEACON
        // ============================================================
        function makePassenger(shirt, skin) {
            const g = new THREE.Group();
            const skinM = new THREE.MeshStandardMaterial({ color: skin });
            const shirtM = new THREE.MeshStandardMaterial({ color: shirt });
            const pantM = new THREE.MeshStandardMaterial({ color: 0x222831 });
            [-0.18, 0.18].forEach(x => { const l = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.8, 0.25), pantM); l.position.set(x, 0.4, 0); l.castShadow = true; g.add(l); });
            const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.9, 14), shirtM); torso.position.y = 1.25; torso.castShadow = true; g.add(torso);
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 14, 14), skinM); head.position.y = 1.95; head.castShadow = true; g.add(head);
            const hair = new THREE.Mesh(new THREE.SphereGeometry(0.285, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x111111 })); hair.position.y = 1.97; g.add(hair);
            const armL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.7, 0.16), skinM); armL.position.set(-0.46, 1.2, 0); g.add(armL);
            const pivot = new THREE.Group(); pivot.position.set(0.46, 1.55, 0);
            const armR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.7, 0.16), skinM); armR.position.y = -0.3; pivot.add(armR); g.add(pivot);
            g.userData.arm = pivot;
            return g;
        }

        const beacon = new THREE.Group();
        const beamMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide, fog: false });
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 70, 20, 1, true), beamMat); beam.position.y = 35; beacon.add(beam);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false });
        const ring = new THREE.Mesh(new THREE.RingGeometry(ZONE_R - 1.2, ZONE_R, 40), ringMat); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.08; beacon.add(ring);
        const fillMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.12, depthWrite: false });
        const fill = new THREE.Mesh(new THREE.CircleGeometry(ZONE_R - 1.2, 40), fillMat); fill.rotation.x = -Math.PI / 2; fill.position.y = 0.07; beacon.add(fill);
        const gemMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.6), gemMat); gem.position.y = 6.5; beacon.add(gem);
        scene.add(beacon);

        function setTarget() {
            if (curIdx < PASSENGERS.length) {
                const p = PASSENGERS[curIdx];
                target = { type: 'pax', x: ZONE_X, z: p.z, title: 'Pick up ' + p.name, sub: p.stop };
                [beamMat, ringMat, fillMat, gemMat].forEach(m => m.color.setHex(0x00e5ff));
            } else {
                target = { type: 'terminal', x: 18, z: TERMINAL_Z, title: 'Arrive at KitCity', sub: NGS.city + ' · KitCity destination · Drop everyone off' };
                [beamMat, ringMat, fillMat, gemMat].forEach(m => m.color.setHex(0x2ecc71));
            }
            beacon.position.set(target.x, 0, target.z);
        }

        // ============================================================
        // 7. TRAFFIC
        // ============================================================
        const _gm = {}, _mm = {};
        const bxg = (a, b, c) => _gm[a + '|' + b + '|' + c] || (_gm[a + '|' + b + '|' + c] = new THREE.BoxGeometry(a, b, c));
        const mtl = c => _mm[c] || (_mm[c] = new THREE.MeshLambertMaterial({ color: c }));
        const lightG = new THREE.BoxGeometry(0.4, 0.25, 0.08);
        const headM = new THREE.MeshBasicMaterial({ color: 0xffffcc });
        const tailM = new THREE.MeshBasicMaterial({ color: 0xff2200 });
        const tankG = new THREE.CylinderGeometry(1.15, 1.15, 6, 14).rotateX(Math.PI / 2);
        const DARK = 0x15202b;
        function makeTraffic(kind, cols) {
            const g = new THREE.Group(); let halfW = 1, halfL = 2.1;
            const c0 = cols && cols[0] != null ? cols[0] : null, c1 = cols && cols[1] != null ? cols[1] : 0x111111;
            const part = (geo, c, x, y, z) => { const m = new THREE.Mesh(geo, mtl(c)); m.position.set(x, y, z); g.add(m); return m; };
            const lamps = (zf, zr, y, dx) => [-dx, dx].forEach(x => {
                const h = new THREE.Mesh(lightG, headM); h.position.set(x, y, -zf); g.add(h);
                const t = new THREE.Mesh(lightG, tailM); t.position.set(x, y, zr); g.add(t);
            });
            if (kind === 'danfo') {
                part(bxg(2.4, 2.1, 5.4), c0 == null ? 0xf5b014 : c0, 0, 1.5, 0).castShadow = false;
                part(bxg(2.44, 0.3, 5.44), c1, 0, 1.0, 0); part(bxg(2.46, 0.6, 3.6), DARK, 0, 1.95, 0.3);
                halfW = 1.2; halfL = 2.7; lamps(2.72, 2.72, 1.0, 0.8);
            } else if (kind === 'bus') {
                part(bxg(2.6, 2.6, 9), c0 == null ? 0x2f6dd0 : c0, 0, 1.7, 0); part(bxg(2.64, 0.9, 7.6), DARK, 0, 2.2, 0); part(bxg(2.62, 0.25, 9.02), 0xffffff, 0, 1.2, 0);
                halfW = 1.3; halfL = 4.5; lamps(4.52, 4.52, 1.0, 0.9);
            } else if (kind === 'keke') {
                part(bxg(1.4, 1.1, 2.2), c0 == null ? 0xe0a020 : c0, 0, 0.9, 0.1); part(bxg(1.5, 0.12, 1.9), 0x111111, 0, 1.85, 0.2);
                [[-0.7, -0.4], [0.7, -0.4], [-0.7, 0.9], [0.7, 0.9]].forEach(a => part(bxg(0.06, 0.8, 0.06), 0x222222, a[0], 1.4, a[1]));
                part(bxg(0.3, 0.55, 0.55), 0x111111, 0, 0.28, -1.0);
                halfW = 0.75; halfL = 1.3; const h = new THREE.Mesh(lightG, headM); h.position.set(0, 0.9, -1.0); g.add(h);
            } else if (kind === 'brt') {
                // Modern city BRT: long red/white body, dark continuous window band and route stripe.
                part(bxg(2.65, 2.8, 10.8), c0 == null ? 0xc9343a : c0, 0, 1.78, 0);
                part(bxg(2.68, 0.95, 9.1), DARK, 0, 2.35, 0.15);
                part(bxg(2.7, 0.16, 10.85), 0xf4f5f7, 0, 1.25, 0);
                part(bxg(2.72, 0.12, 10.4), 0x00a8b5, 0, 1.43, 0);
                halfW = 1.35; halfL = 5.4; lamps(5.42, 5.42, 1.0, 0.9);
            } else if (kind === 'bicycle') {
                const tire = new THREE.MeshStandardMaterial({ color: 0x17191c, roughness: 0.92 });
                const metal = new THREE.MeshStandardMaterial({ color: 0xc4d0d5, metalness: 0.72, roughness: 0.32 });
                const wheel = (z) => {
                    const w = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.055, 8, 20), tire);
                    w.rotation.x = Math.PI / 2; w.position.set(0, 0.47, z); g.add(w);
                    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.12, 10), metal);
                    hub.rotation.x = Math.PI / 2; hub.position.set(0, 0.47, z); g.add(hub);
                };
                wheel(-0.82); wheel(0.82);
                const tube = (a, b, radius, color) => {
                    const va = new THREE.Vector3(a[0], a[1], a[2]), vb = new THREE.Vector3(b[0], b[1], b[2]);
                    const delta = new THREE.Vector3().subVectors(vb, va);
                    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, delta.length(), 7), color);
                    mesh.position.copy(va).add(vb).multiplyScalar(0.5);
                    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
                    g.add(mesh);
                };
                const frame = metal;
                tube([0,0.47,-0.82],[0,0.92,-0.18],0.045,frame);
                tube([0,0.92,-0.18],[0,0.47,0.82],0.045,frame);
                tube([0,0.47,0.82],[0,0.47,-0.82],0.045,frame);
                tube([0,0.92,-0.18],[0,1.05,0.2],0.045,frame);
                tube([0,1.05,0.2],[0,0.47,0.82],0.045,frame);
                // Compact rider silhouette so bicycles read clearly at road scale.
                part(bxg(0.25,0.55,0.28), c0 == null ? 0x2767a8 : c0, 0, 1.32, 0.02);
                part(new THREE.SphereGeometry(0.17, 10, 8), 0x4a3020, 0, 1.72, 0.03);
                part(bxg(0.12,0.52,0.12), 0x2b3540, 0, 0.92, -0.12);
                halfW = 0.62; halfL = 1.0;
            } else if (kind === 'okada') {
                part(bxg(0.35, 0.5, 1.7), c0 == null ? pick([0xc0392b, 0x2c3e50, 0x16a085, 0xe67e22]) : c0, 0, 0.6, 0);
                part(bxg(0.45, 0.8, 0.35), pick([0xe74c3c, 0x3498db, 0xf1c40f, 0xecf0f1, 0x2ecc71]), 0, 1.25, 0.1); part(bxg(0.3, 0.3, 0.3), 0x4a3020, 0, 1.8, 0.1);
                halfW = 0.45; halfL = 1.0;
            } else if (kind === 'truck') {
                part(bxg(2.4, 2.0, 2.0), c0 == null ? pick([0x2c6fbb, 0xc0392b, 0x2e8b57, 0xe67e22]) : c0, 0, 1.3, -2.7);
                part(bxg(2.5, 0.4, 6.2), 0x333333, 0, 0.8, 1.0);
                part(bxg(2.2, 1.6, 4.6), pick([0x8a6a3a, 0x9a7a4a, 0xb89a60, 0x7a8a6a]), 0, 1.8, 1.2);
                halfW = 1.3; halfL = 3.9;
                const h = new THREE.Mesh(lightG, headM); h.position.set(-0.8, 0.9, -3.72); g.add(h); const h2 = h.clone(); h2.position.x = 0.8; g.add(h2);
                const t = new THREE.Mesh(lightG, tailM); t.position.set(-0.8, 0.9, 4.12); g.add(t); const t2 = t.clone(); t2.position.x = 0.8; g.add(t2);
            } else if (kind === 'tanker') {
                part(bxg(2.4, 2.0, 2.0), pick([0x2c6fbb, 0xc0392b, 0x2e8b57]), 0, 1.3, -2.7);
                part(bxg(2.5, 0.4, 6.2), 0x333333, 0, 0.8, 1.0);
                const tk = new THREE.Mesh(tankG, mtl(c0 == null ? 0xdddddd : c0)); tk.position.set(0, 1.95, 1.1); g.add(tk);
                halfW = 1.3; halfL = 3.9;
                const h = new THREE.Mesh(lightG, headM); h.position.set(0, 0.9, -3.72); g.add(h);
                const t = new THREE.Mesh(lightG, tailM); t.position.set(0, 0.9, 4.12); g.add(t);
            } else {   // sedan / cab
                const isCab = kind === 'cab';
                const body = isCab ? (c0 == null ? 0x2e8b57 : c0) : (cols && cols.length && !isCab ? pick(cols) : pick([0xffffff, 0xc0392b, 0x2c3e50, 0x7f8c8d, 0x27ae60, 0x2980b9]));
                part(bxg(2.0, 0.9, 4.2), body, 0, 0.75, 0); part(bxg(1.7, 0.75, 2.2), DARK, 0, 1.5, 0.2);
                if (isCab) { part(bxg(1.72, 0.12, 2.22), c1 === 0x111111 ? 0xffffff : c1, 0, 1.93, 0.2); part(bxg(0.6, 0.25, 0.3), 0xffe08a, 0, 2.1, 0.2); }
                halfW = 1.0; halfL = 2.1; lamps(2.12, 2.12, 0.85, 0.65);
            }
            return { g, halfW, halfL };
        }

        const traffic = [];
        const LANES_SAME = [4.5, 11.5], LANES_OPP = [-4.5, -11.5];
        const SPEEDK = { truck: 0.8, tanker: 0.78, brt: 0.82, bus: 0.9, bicycle: 0.55, okada: 1.15, keke: 0.85, danfo: 1, sedan: 1, cab: 1 };
        const mixList = []; Object.keys(V.veh || { danfo: 1, sedan: 1 }).forEach(k => { for (let i = 0; i < V.veh[k]; i++) mixList.push(k); });
        // Guarantee visible variety even when a state's visual profile has a sparse traffic preset.
        ['bicycle', 'brt', 'keke', 'truck', 'danfo', 'bus', 'okada', 'sedan'].forEach(k => { if (!mixList.includes(k)) mixList.push(k); });
        const NT = Math.max(28, Math.min(34, V.tn ? V.tn + 18 : 30));
        const ROAD_SHOWCASE = ['danfo', 'keke', 'bicycle', 'truck', 'brt', 'bus', 'okada', 'sedan', 'danfo', 'keke', 'truck', 'brt'];
        for (let i = 0; i < NT; i++) {
            const same = i < Math.round(NT * 0.45);
            const kind = i < ROAD_SHOWCASE.length ? ROAD_SHOWCASE[i] : pick(mixList);
            const t = makeTraffic(kind, V.vc && V.vc[kind]);
            t.same = same; t.kind = kind;
            t.lanes = same ? LANES_SAME : LANES_OPP;
            t.vz = (same ? -rand(7, 13) : rand(12, 19)) * (SPEEDK[kind] || 1);
            t.boost = 0; t.x = 999; t.z = 999;
            if (!same) t.g.rotation.y = Math.PI;
            scene.add(t.g);
            traffic.push(t);
        }

        function placeTraffic(t, zMin, zMax, safe) {
            for (let k = 0; k < 18; k++) {
                const lane = pick(t.lanes), z = rand(zMin, zMax);
                if (safe && Math.abs(lane - car.x) < 4 && Math.abs(z - car.z) < 30) continue;
                if (traffic.some(o => o !== t && o.x === lane && Math.abs(o.z - z) < 55)) continue;
                t.x = lane; t.z = z; t.prevDz = undefined; t.g.position.set(lane, 0, z); return;
            }
            t.x = pick(t.lanes); t.z = rand(zMin, zMax); t.g.position.set(t.x, 0, t.z);
        }
        // Seed traffic directly into the player's visible forward corridor.
        // Every requested road type gets an explicit near-field slot; no type relies on random presets.
        const TRAFFIC_SLOTS = [
            [4.5,  -35], [-4.5, -58], [11.5, -82], [-11.5, -106],
            [4.5, -132], [-4.5, -158], [11.5, -184], [-11.5, -210],
            [4.5, -236], [-4.5, -262], [11.5, -288], [-11.5, -314]
        ];
        traffic.forEach((t, i) => {
            const slot = TRAFFIC_SLOTS[i % TRAFFIC_SLOTS.length];
            const lane = slot[0], z = slot[1];
            t.x = lane; t.z = z; t.prevDz = undefined;
            t.g.visible = true;
            t.g.frustumCulled = false;
            t.g.position.set(lane, 0, z);
            t.g.traverse(m => {
                if (m.isMesh) {
                    m.frustumCulled = false;
                    m.castShadow = true;
                    m.receiveShadow = true;
                }
            });
        });

        function updateTraffic(dt) {
            traffic.forEach(t => {
                if (t.boost > 0) t.boost = Math.max(0, t.boost - dt * 2);
                const base = t.same ? t.vz - t.boost : t.vz;
                let blocked = false;
                for (let k = 0; k < crossers.length && !blocked; k++) { const c = crossers[k]; if (c.active && crosserBlocks(c, t)) blocked = true; }
                t.slow += ((blocked ? 0 : 1) - t.slow) * Math.min(1, dt * (blocked ? 4 : 1.2));
                if (blocked && t.slow < 0.4 && jamHornT <= 0 && state.started && Math.random() < dt * 0.5) { jamHornT = rand(4, 8); sfxFarHorn(); }
                const sv = base * t.slow;
                t.z += sv * dt;
                const dz = t.z - car.z;
                if (t.prevDz !== undefined && t.prevDz < 0 && dz >= 0 && Math.abs(t.x - car.x) < 16 && state.started) {
                    const rel = Math.abs(sv + Math.cos(car.h) * car.speed);
                    sfxWhoosh(clamp((t.x - car.x) / 10, -1, 1), clamp(rel / 45, 0.15, 1));
                }
                t.prevDz = dz;
                if (dz > 140) placeTraffic(t, car.z - 620, car.z - 400, false);
                else if (dz < -320) placeTraffic(t, car.z + 80, car.z + 190, false);
                t.g.position.set(t.x, 0, t.z);
                // Traffic is part of the road world and must remain renderable on every road section.
                // The old bridge-distance visibility gate could hide entire classes of vehicles.
                t.g.visible = true;
                t.g.frustumCulled = false;
            });
        }

        function checkCollisions(dt) {
            if (collideCD > 0) collideCD -= dt;
            const sh = Math.sin(car.h), ch = Math.cos(car.h);
            for (const t of traffic) {
                if (!t.g.visible) continue;
                const dx = t.x - car.x, dz = t.z - car.z;
                if (Math.abs(dx) > 9 || Math.abs(dz) > 10) continue;
                const lx = dx * ch - dz * sh;       // + = other car on my right
                const lz = -dx * sh - dz * ch;      // + = other car ahead of me
                const penX = (t.halfW + 1.3) - Math.abs(lx);
                const penZ = (t.halfL + 3.2) - Math.abs(lz);
                if (penX > 0 && penZ > 0) {
                    if (penX < penZ) {
                        const s = lx > 0 ? -1 : 1;
                        car.x += s * ch * penX; car.z += -s * sh * penX;
                    } else {
                        const s = lz > 0 ? 1 : -1;
                        car.x += s * sh * penZ; car.z += s * ch * penZ;
                        if (lz > 0 && car.speed > 0) {
                            const vo = (t.same ? t.vz - t.boost : t.vz) * -ch;
                            car.speed = Math.min(car.speed, Math.max(2, vo));
                        }
                    }
                    if (collideCD <= 0) {
                        car.speed *= 0.5;
                        collideCD = 1;
                        collisions++; mHit(8);
                        impactScore = Math.max(0, impactScore - 50);
                        updateHud();
                        shake = 1; vibe = Math.max(0, vibe - 15);
                        const f = $('flash'); f.classList.add('on'); setTimeout(() => f.classList.remove('on'), 80);
                        sfxCrash();
                        toast('Crash! -50 pts. Drive carefully.');
                    }
                }
            }
        }

        // ============================================================
        // 8. INPUT
        // ============================================================
        const keys = {};
        const touch = { gas: false, brake: false, reverse: false, hop: false, horn: false, steer: 0, steerActive: false };
        let hopT = 0, hopY = 0, hopCooldown = 0;
        let kbHorn = false, reverseIn = 0;

        addEventListener('keydown', e => {
            const k = e.key.toLowerCase();
            if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) { if (k === 'escape') e.target.blur(); return; }
            if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
            if (e.repeat) return;
            keys[k] = true;
            if (k === 'e' || k === 'enter') tryInteract();
            if (k === 'c') toggleCam();
            if (k === 'r') recover();
            if (k === 'm') toggleMute();
            if (k === 'f') fmToggle();
            if (k === 'h') kbHorn = true;
            if (k === 'j') touch.hop = true;
        });
        addEventListener('keyup', e => { const k = e.key.toLowerCase(); keys[k] = false; if (k === 'h') kbHorn = false; if (k === 'j') touch.hop = false; });
        addEventListener('blur', () => { for (const k in keys) keys[k] = false; kbHorn = false; touch.hop = false; });
        addEventListener('contextmenu', e => e.preventDefault());

        function bindHold(el, down, up) {
            el.addEventListener('pointerdown', e => {
                e.preventDefault();
                try { el.setPointerCapture(e.pointerId); } catch (_) {}
                el.classList.add('active'); down();
            });
            const end = () => { el.classList.remove('active'); up(); };
            ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => el.addEventListener(ev, end));
        }
        bindHold($('gas'), () => { touch.gas = true; }, () => { touch.gas = false; });
        bindHold($('brake'), () => { touch.brake = true; touch.reverse = false; }, () => { touch.brake = false; });
        bindHold($('reverse'), () => { touch.reverse = true; touch.gas = false; }, () => { touch.reverse = false; });
        bindHold($('hop'), () => { touch.hop = true; }, () => { touch.hop = false; });
        bindHold($('horn'), () => { touch.horn = true; }, () => { touch.horn = false; });

        // Swipe once = move exactly one lane; the danfo then steers itself and settles in the lane centre
        (function () {
            const zone = $('steer-zone'); let pid = null, sx = 0, fired = false; const SWIPE = 28;
            zone.addEventListener('pointerdown', e => {
                e.preventDefault(); pid = e.pointerId; sx = e.clientX; fired = false;
                try { zone.setPointerCapture(e.pointerId); } catch (_) {}
            });
            zone.addEventListener('pointermove', e => {
                if (e.pointerId !== pid || fired) return;
                const dx = e.clientX - sx;
                if (Math.abs(dx) >= SWIPE) { fired = true; changeLane(dx > 0 ? 1 : -1); }
            });
            const end = e => { if (e.pointerId !== pid) return; pid = null; fired = false; };
            ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => zone.addEventListener(ev, end));
        })();

        function releaseTouch() {
            touch.gas = touch.brake = touch.reverse = touch.hop = touch.horn = false; touch.steer = 0; touch.steerActive = false;
            document.querySelectorAll('.pedal, #horn').forEach(el => el.classList.remove('active'));
        }
        const lifted = e => { if (e.touches && e.touches.length === 0) releaseTouch(); };
        addEventListener('touchend', lifted); addEventListener('touchcancel', lifted);

        $('btn-cam').addEventListener('click', toggleCam);
        $('btn-recover').addEventListener('click', recover);
        $('btn-mute').addEventListener('click', toggleMute);
        $('prompt').addEventListener('click', tryInteract);

        function toggleCam() {
            camMode = camMode === 'chase' ? 'fp' : 'chase';
            glassMeshes.forEach(m => { m.visible = camMode === 'chase'; });
            snapCamera = true;
            toast(camMode === 'fp' ? 'Driver view' : 'Chase view');
        }


        // ============================================================
        // 9. AUDIO: ambience, sound effects, radio
        // ============================================================
        let actx = null, master, ambGain, noiseBuf, amb = null;
        let muted = false, ambOn = true;
        let hornNodes = null, hornHeld = 0, farHornT = 8;
        let radioVol = 0.7, radioPlaying = false, fmOn = false;

        function chain() { for (let i = 0; i < arguments.length - 1; i++) arguments[i].connect(arguments[i + 1]); }
        function filt(type, f, q) { const b = actx.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q) b.Q.value = q; return b; }
        function gainNode(v) { const g = actx.createGain(); g.gain.value = v; return g; }
        function noiseSrc() {
            const s = actx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
            s.start(0, Math.random() * 1.5); return s;
        }
        function noiseHit(dest, t, type, f, dur, vol, q) {
            const s = actx.createBufferSource(); s.buffer = noiseBuf;
            const fl = filt(type, f, q), g = actx.createGain();
            g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            chain(s, fl, g, dest); s.start(t, Math.random()); s.stop(t + dur + 0.02);
        }

        function initAudio() {
            if (actx) { if (actx.state === 'suspended') actx.resume(); return; }
            const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
            try {
                actx = new AC();
                master = gainNode(muted ? 0 : 1);
                const comp = actx.createDynamicsCompressor();
                chain(master, comp, actx.destination);
                ambGain = gainNode(0); ambGain.connect(master);
                noiseBuf = actx.createBuffer(1, actx.sampleRate * 2, actx.sampleRate);
                const d = noiseBuf.getChannelData(0);
                for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                buildAmbience();
                buildEngine();
            } catch (err) { actx = null; }
        }

        // Layered, noise-based street + road + engine ambience (no tonal beeps)
        function buildAmbience() {
            amb = {};
            amb.city = gainNode(0.014 * AM[0]);                                   // distant city rumble
            chain(noiseSrc(), filt('lowpass', 380), amb.city, ambGain);
            // calm background gisting: three soft voice bands that rise and fall like relaxed chatter
            [[480, 2.7, 0.9], [900, 3.6, 1.1], [1700, 4.4, 1.4]].forEach(function (v) {
                const g = gainNode(0.0032 * AM[1]);
                const l = actx.createOscillator(); l.frequency.value = v[1];
                const lg = gainNode(0.0028 * AM[1]); chain(l, lg); lg.connect(g.gain); l.start();
                chain(noiseSrc(), filt('bandpass', v[0], v[2]), g, ambGain);
            });
            amb.tyre = gainNode(0); amb.tyreF = filt('bandpass', 520, 0.5);   // tyres on tarmac
            chain(noiseSrc(), amb.tyreF, amb.tyre, ambGain);
            amb.wind = gainNode(0); amb.windF = filt('bandpass', 900, 0.4);   // wind
            chain(noiseSrc(), amb.windF, amb.wind, ambGain);
            amb.sq = gainNode(0);                                             // tyre squeal under hard braking and cornering
            chain(noiseSrc(), filt('bandpass', 2400, 5), amb.sq, ambGain);
            amb.rain = gainNode(0); chain(noiseSrc(), filt('highpass', 2800), filt('lowpass', 9000), amb.rain, ambGain);
            amb.rat = gainNode(0); amb.ratF = filt('bandpass', 1100, 1.2);    // loose body rattle
            chain(noiseSrc(), amb.ratF, amb.rat, ambGain);
            amb.radio = gainNode(0); amb.radioF = filt('bandpass', 2600, 0.8);
            chain(noiseSrc(), amb.radioF, amb.radio, ambGain);
        }

        function updateAmbience(sp, thr) {
            if (!actx || !amb) return;
            const t = actx.currentTime, v = clamp(sp / MAX_V, 0, 1.1), inside = camMode === 'fp';
            let mg = (ambOn && state.started && !streetOK && !fmOn) ? 0.32 : 0;
            if (state.dialogue) mg *= 0.35;
            if (state.ended) mg *= 0.4;
            ambGain.gain.setTargetAtTime(mg, t, 0.25);
            amb.tyre.gain.setTargetAtTime(Math.min(1, v * 1.4) * 0.03, t, 0.1);
            amb.tyreF.frequency.setTargetAtTime(380 + v * 500, t, 0.1);
            amb.wind.gain.setTargetAtTime(v * v * (inside ? 0.02 : 0.04) + AM[2] * 0.006, t, 0.1);
            amb.rain.gain.setTargetAtTime(AM[3] * 0.03 * (inside ? 0.6 : 1), t, 0.3);
            amb.windF.frequency.setTargetAtTime(700 + v * 1800, t, 0.1);
            const sqT = (braking && sp > 8) ? Math.min(1, (sp - 8) / 20) * 0.03 : 0;
            amb.sq.gain.setTargetAtTime(sqT, t, 0.05);
            amb.rat.gain.setTargetAtTime(0, t, 0.1);
            const radioDuck = state.dialogue ? 0.18 : 1;
            amb.radio.gain.setTargetAtTime(fmOn && radioPlaying && !muted ? 0.0065 * radioDuck : 0, t, 0.12);
        }

        function panTo(node, pan) {
            if (actx.createStereoPanner) { const p = actx.createStereoPanner(); p.pan.value = pan; chain(node, p, ambGain); }
            else node.connect(ambGain);
        }
        function sfxWhoosh(pan, amt) {      // a car whooshing past
            if (!actx || !ambOn || fmOn) return;
            const t = actx.currentTime;
            const s = actx.createBufferSource(); s.buffer = noiseBuf;
            const bp = filt('bandpass', 900, 0.8);
            bp.frequency.setValueAtTime(900, t); bp.frequency.exponentialRampToValueAtTime(260, t + 0.7);
            const g = gainNode(0.0001);
            g.gain.linearRampToValueAtTime(0.07 * amt, t + 0.12); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
            chain(s, bp, g); panTo(g, pan);
            s.start(t, Math.random()); s.stop(t + 0.9);
        }
        function sfxFarHorn() {             // distant traffic horn, soft and filtered
            if (!actx || !ambOn || fmOn) return;
            const t = actx.currentTime, base = pick([392, 440, 466, 523]), n = pick([1, 1, 2]);
            const g = gainNode(0), lp = filt('lowpass', 1500);
            const o1 = actx.createOscillator(), o2 = actx.createOscillator();
            o1.type = 'sawtooth'; o2.type = 'sawtooth'; o1.frequency.value = base; o2.frequency.value = base * 1.26;
            chain(o1, lp); chain(o2, lp); chain(lp, g);
            for (let i = 0; i < n; i++) {
                const s = t + i * 0.34;
                g.gain.setValueAtTime(0.0001, s); g.gain.linearRampToValueAtTime(0.014, s + 0.03);
                g.gain.setValueAtTime(0.014, s + 0.2); g.gain.linearRampToValueAtTime(0.0001, s + 0.26);
            }
            panTo(g, rand(-0.9, 0.9));
            const end = t + n * 0.34 + 0.1;
            o1.start(t); o2.start(t); o1.stop(end); o2.stop(end);
        }

        // player horn: sounds only while the button is held
        function hornStart() {
            if (!actx || hornNodes) return;
            const t = actx.currentTime;
            const g = gainNode(0); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09, t + 0.02); g.connect(master);
            const os = [349, 440].map(f => { const o = actx.createOscillator(); o.type = 'square'; o.frequency.value = f; o.connect(g); o.start(); return o; });
            hornNodes = { g: g, os: os };
        }
        function hornStop() {
            if (!hornNodes) return;
            const n = hornNodes; hornNodes = null;
            const t = actx.currentTime;
            n.g.gain.cancelScheduledValues(t); n.g.gain.setValueAtTime(n.g.gain.value, t); n.g.gain.linearRampToValueAtTime(0, t + 0.05);
            n.os.forEach(o => o.stop(t + 0.08));
        }

        function tone(freq, dur, type, vol, delay, slideTo) {
            if (!actx) return;
            const t0 = actx.currentTime + (delay || 0);
            const o = actx.createOscillator(); o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t0);
            if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
            const g = actx.createGain(); g.gain.setValueAtTime(vol || 0.15, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
            o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.02);
        }
        function sfxCrash() { if (!actx) return; tone(110, 0.3, 'sine', 0.4, 0, 38); noiseHit(master, actx.currentTime, 'lowpass', 2000, 0.4, 0.45); }
        function sfxDoor() { if (!actx) return; noiseHit(master, actx.currentTime, 'lowpass', 900, 0.2, 0.3); tone(120, 0.14, 'sine', 0.3, 0, 60); }
        function sfxGood() { tone(660, 0.12, 'sine', 0.18, 0); tone(880, 0.12, 'sine', 0.18, 0.1); tone(1175, 0.25, 'sine', 0.18, 0.2); }
        function sfxBad() { tone(220, 0.25, 'sawtooth', 0.15, 0, 110); }
        function sfxCoin(n) {
            if (!actx) return;
            const f = 1175 * Math.pow(1.0595, Math.min(n, 8));
            tone(f, 0.09, 'square', 0.06, 0); tone(f * 1.5, 0.22, 'sine', 0.12, 0.07);
        }
        function sfxThump() { if (!actx) return; tone(95, 0.28, 'sine', 0.45, 0, 42); noiseHit(master, actx.currentTime, 'lowpass', 600, 0.25, 0.3); }
        function sfxYelp() {
            if (!actx) return;
            const t = actx.currentTime, o = actx.createOscillator(), bp = filt('bandpass', 850, 4), g = gainNode(0.0001);
            o.type = 'sawtooth'; o.frequency.setValueAtTime(330, t); o.frequency.exponentialRampToValueAtTime(210, t + 0.4);
            g.gain.linearRampToValueAtTime(0.16, t + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
            chain(o, bp, g, master); o.start(t); o.stop(t + 0.5);
        }

        // ----- Recorded street ambience: voices, distant horns, street vibe -----
        // Put a short looping clip named street.mp3 next to this file, or embed it (see the embed command).
        const STREET_B64 = '';
        const STREET_FILE = 'street.mp3';
        const STREET_VOL = 0.14;
        let street = null, streetOK = false;
        function initStreet() {
            if (street) return;
            try {
                street = new Audio(STREET_B64 ? 'data:audio/mpeg;base64,' + STREET_B64 : STREET_FILE);
                street.loop = true; street.preload = 'auto'; street.volume = 0;
                street.addEventListener('canplaythrough', () => { streetOK = true; });
                street.addEventListener('error', () => { streetOK = false; street = null; });
                const p = street.play(); if (p && p.catch) p.catch(() => {});
            } catch (e) { street = null; }
        }
        function updateStreet(dt) {
            if (!street) return;
            let tv = (ambOn && state.started && !muted && !fmOn) ? STREET_VOL : 0;
            if (state.dialogue) tv *= 0.5;
            if (state.ended) tv *= 0.5;
            street.volume = clamp(street.volume + (tv - street.volume) * Math.min(1, dt * 3), 0, 1);
            if (street.paused && tv > 0) { const p = street.play(); if (p && p.catch) p.catch(() => {}); }
        }

        // ----- Danfo engine: rough diesel, gearbox and starter, driven by speed and throttle -----
        const GEARS = [0, 7.5, 14, 22, 31, 43];      // top speed (m/s) in each gear, 5-speed box
        const IDLE_RPM = 820, REDLINE_RPM = 4100;
        const eng = { phase: 'off', t: 0, gear: 1, rpm: 0, shift: 0, n: null };

        function distCurve(k) {
            const n = 256, c = new Float32Array(n);
            for (let i = 0; i < n; i++) { const x = i * 2 / n - 1; c[i] = (1 + k) * x / (1 + k * Math.abs(x)); }
            return c;
        }
        function buildEngine() {
            const e = eng.n = {};
            e.bus = gainNode(0); e.bus.connect(master);
            const shaper = actx.createWaveShaper(); shaper.curve = distCurve(5);
            e.lp = filt('lowpass', 500, 0.7);
            e.am = gainNode(1);
            e.oA = actx.createOscillator(); e.oA.type = 'sawtooth';        // firing pulses
            e.oB = actx.createOscillator(); e.oB.type = 'square';          // low block thump
            e.oC = actx.createOscillator(); e.oC.type = 'sawtooth';        // rough upper growl
            chain(e.oA, gainNode(0.28), e.am);
            chain(e.oB, gainNode(0.16), e.am);
            chain(e.oC, gainNode(0.09), e.am);
            chain(e.am, shaper, e.lp, e.bus);
            e.lump = actx.createOscillator(); e.lumpG = gainNode(0.08);     // uneven cylinders, lumpy at idle
            chain(e.lump, e.lumpG); e.lumpG.connect(e.am.gain);
            e.knockF = filt('bandpass', 1700, 1.1); e.knockAm = gainNode(0.13); e.knock = gainNode(0);   // diesel clatter
            e.knockLfo = actx.createOscillator(); e.knockLfo.type = 'square';
            const kg = gainNode(0.28); chain(e.knockLfo, kg); kg.connect(e.knockAm.gain);
            chain(noiseSrc(), e.knockF, e.knockAm, e.knock, e.bus);
            e.rumF = filt('lowpass', 160); e.rum = gainNode(0);            // loose exhaust rumble
            chain(noiseSrc(), e.rumF, e.rum, e.bus);
            e.whine = actx.createOscillator(); e.whine.type = 'sine'; e.whineG = gainNode(0);   // old gearbox whine
            chain(e.whine, e.whineG, e.bus);
            e.starter = actx.createOscillator(); e.starter.type = 'sawtooth'; e.starterF = filt('lowpass', 650); e.starterG = gainNode(0);
            chain(e.starter, e.starterF, e.starterG, e.bus);
            [e.oA, e.oB, e.oC, e.lump, e.knockLfo, e.whine, e.starter].forEach(o => o.start());
        }

        function updateEngine(dt) {
            if (!actx || !eng.n) return;
            const e = eng.n, t = actx.currentTime;
            const sp = car.speed, asp = Math.abs(sp), thr = throttleIn, inside = camMode === 'fp';

            if (eng.phase === 'off' && state.started && !state.ended) { eng.phase = 'crank'; eng.t = 0; }
            if (eng.phase === 'run' && state.ended && asp < 0.6) eng.phase = 'stopped';

            let lvl = 0, frac = 0;
            if (eng.phase === 'crank') {
                eng.t += dt;
                eng.rpm = 230 + Math.sin(eng.t * 22) * 55;
                e.starter.frequency.setTargetAtTime(95 + eng.t * 55, t, 0.05);
                e.starterG.gain.setTargetAtTime(0.05, t, 0.03);
                lvl = 0.07;
                if (eng.t > 0.95) { eng.phase = 'run'; eng.rpm = 1650; e.starterG.gain.setTargetAtTime(0, t, 0.03); }
            } else if (eng.phase === 'run') {
                // gear selection
                if (sp < -0.3) eng.gear = 0;
                else {
                    if (eng.gear === 0) eng.gear = 1;
                    if (eng.shift <= 0) {
                        if (eng.gear < 5 && thr && sp > GEARS[eng.gear] * 0.93) { eng.gear++; eng.shift = 0.24; }
                        else if (eng.gear > 1 && sp < GEARS[eng.gear - 1] * 0.45) { eng.gear--; eng.shift = 0.14; }
                    }
                }
                if (eng.shift > 0) eng.shift -= dt;
                let target;
                if (eng.gear === 0) target = IDLE_RPM + clamp(asp / 6, 0, 1) * 2300;
                else {
                    target = IDLE_RPM + clamp(sp / GEARS[eng.gear], 0, 1.05) * (REDLINE_RPM - IDLE_RPM) * 0.95;
                    if (thr && eng.gear <= 2) target = Math.max(target, IDLE_RPM + (REDLINE_RPM - IDLE_RPM) * 0.3);
                }
                const rate = eng.shift > 0 ? 14 : (target > eng.rpm ? 6 : 3.5);
                eng.rpm += (target - eng.rpm) * Math.min(1, dt * rate);
                frac = clamp((eng.rpm - IDLE_RPM) / (REDLINE_RPM - IDLE_RPM), 0, 1);
                lvl = (0.026 + 0.038 * thr * (0.5 + 0.5 * frac) + 0.018 * frac) * (eng.shift > 0 ? 0.55 : 1);
            } else {
                eng.rpm *= Math.max(0, 1 - dt * 3);
            }
            if (state.dialogue) lvl *= 0.22;
            if (state.ended) lvl *= 0.6;
            if (inside) lvl *= 0.92;
            e.bus.gain.setTargetAtTime(lvl * 0.52, t, 0.05);

            const wob = 1 + 0.012 * Math.sin(time * 37) + 0.01 * Math.sin(time * 23.7);
            const f0 = Math.max(4, eng.rpm * wob / 30);          // 4-cylinder, 4-stroke: two firings per turn
            e.oA.frequency.setTargetAtTime(f0, t, 0.03);
            e.oB.frequency.setTargetAtTime(f0 * 0.5, t, 0.03);
            e.oC.frequency.setTargetAtTime(f0 * 3.02, t, 0.03);
            e.lump.frequency.setTargetAtTime(f0 / 4, t, 0.03);
            e.knockLfo.frequency.setTargetAtTime(f0, t, 0.03);
            e.lumpG.gain.setTargetAtTime(0.025 + 0.12 * (1 - frac), t, 0.1);
            e.lp.frequency.setTargetAtTime(420 + frac * 1100 + thr * 450, t, 0.06);
            e.knock.gain.setTargetAtTime(Math.max(0.012, 0.035 + thr * 0.02 - frac * 0.02), t, 0.1);
            e.rumF.frequency.setTargetAtTime(120 + frac * 220, t, 0.08);
            e.rum.gain.setTargetAtTime(0.045 + thr * 0.045 + frac * 0.035, t, 0.1);
            e.whine.frequency.setTargetAtTime(140 + asp * 14, t, 0.05);
            e.whineG.gain.setTargetAtTime(clamp(asp / MAX_V, 0, 1) * (eng.gear === 0 ? 0.05 : 0.025), t, 0.1);
        }

        function toggleMute() {
            muted = !muted; $('btn-mute').textContent = muted ? '🔇' : '🔊';
            if (master) master.gain.value = muted ? 0 : 1;
            if (fmPlayer && fmPlayer.mute) { try { if (muted) fmPlayer.mute(); else fmPlayer.unMute(); } catch (e) {} }
            if (muted && typeof speechSynthesis !== 'undefined') { try { speechSynthesis.cancel(); } catch (e) {} }
        }

        // ----- FM: tap to play, back / next. Hidden audio-only player, no video card -----
        const FM_STATIONS = [
            ['Naija Drive', 'bGgjIvWj2I0'],
            ['Naija Pulse', 'pT5TaX6fN2c'],
            ['Afro Gold', 'qbefFtgUVTY'],
            ['Praise Nigeria', '36cBGrwfuwQ'],
            ['Igbo Highlife', '9YJRzqD_cSE'],
            ['Yoruba Fuji', 'SPmRi1lieYQ'],
            ['Fuji Road', 'IQJ6dz9K4LA'],
            ['Naija Classics', 'DDgBek2xV0k']
        ];
        let fmIdx = 0, fmPlayer = null, fmLoaded = -1, fmLoading = false, fmQueue = null, fmErr = 0, fmTimer = null;
        function fmUI() {
            $('btn-fm').classList.toggle('on', fmOn);
            $('fm-bar').style.display = fmOn ? 'flex' : 'none';
            $('fm-name').textContent = FM_STATIONS[fmIdx][0];
        }
        function fmLoadAPI(cb) {
            if (window.YT && window.YT.Player) { cb(); return; }
            fmQueue = cb; if (fmLoading) return; fmLoading = true;
            window.onYouTubeIframeAPIReady = () => { const q = fmQueue; fmQueue = null; if (q) q(); };
            const t = document.createElement('script'); t.src = 'https://www.youtube.com/iframe_api';
            t.onerror = () => { fmLoading = false; fmOff(); toast('FM needs an internet connection'); };
            document.head.appendChild(t);
        }
        function fmStart() {
            fmLoadAPI(() => {
                if (!fmOn) return;
                const id = FM_STATIONS[fmIdx][1];
                if (fmPlayer && fmPlayer.loadVideoById) {
                    try {
                        if (fmLoaded === fmIdx) fmPlayer.playVideo(); else fmPlayer.loadVideoById(id);
                        fmLoaded = fmIdx; fmPlayer.setVolume(Math.round(radioVol * 100));
                    } catch (e) {}
                    return;
                }
                fmLoaded = fmIdx;
                try {
                    fmPlayer = new YT.Player('yt-player', {
                        width: 200, height: 200, videoId: id,
                        playerVars: { autoplay: 1, playsinline: 1, controls: 0, rel: 0, modestbranding: 1, loop: 1, playlist: id },
                        events: {
                            onReady: e => { try { e.target.setVolume(Math.round(radioVol * 100)); if (muted) e.target.mute(); if (fmOn) e.target.playVideo(); } catch (_) {} },
                            onStateChange: e => {
                                if (e.data === 1) { radioPlaying = true; fmErr = 0; clearTimeout(fmTimer); }
                                else if (e.data === 2) radioPlaying = false;
                                else if (e.data === 0 && fmOn) fmStep(1);
                            },
                            onError: e => {
                                radioPlaying = false; fmErr++;
                                if (e.data === 153) { toast('FM needs the game opened from https or localhost'); fmOff(); return; }
                                if (fmErr < FM_STATIONS.length) { toast('Station unavailable, skipping'); fmStep(1); } else { toast('No station could play'); fmOff(); }
                            }
                        }
                    });
                } catch (e) { toast('FM could not start'); fmOff(); }
            });
        }
        function fmOnNow() {
            initAudio(); fmOn = true; fmUI(); fmStart();
            clearTimeout(fmTimer); fmTimer = setTimeout(() => { if (fmOn && !radioPlaying) toast('Tap FM twice if it stays silent'); }, 7000);
        }
        function fmOff() {
            fmOn = false; radioPlaying = false; clearTimeout(fmTimer);
            try { if (fmPlayer && fmPlayer.pauseVideo) fmPlayer.pauseVideo(); } catch (e) {}
            fmUI();
        }
        function fmToggle() { if (fmOn) fmOff(); else fmOnNow(); }
        function fmStep(d) {
            fmIdx = (fmIdx + d + FM_STATIONS.length) % FM_STATIONS.length;
            fmUI(); if (fmOn) fmStart();
        }
        $('btn-fm').addEventListener('click', fmToggle);
        $('fm-prev').addEventListener('click', () => fmStep(-1));
        $('fm-next').addEventListener('click', () => fmStep(1));



        // ============================================================
        // 10. DIALOGUE & PICK-UP
        // ============================================================
        let toastTimer = null;
        function toast(msg) {
            const t = $('toast'); t.textContent = msg; t.classList.add('show');
            clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
        }

        function tryInteract() {
            if (!state.started || state.dialogue || state.ended || !target || target.type !== 'pax') return;
            if (Math.hypot(car.x - target.x, car.z - target.z) >= ZONE_R) return;
            if (Math.abs(car.speed) > 5) { toast('Slow down to pick up!'); return; }
            openDialogue();
        }

        function openDialogue() {
            state.dialogue = true; car.speed = 0; releaseTouch();
            if (fmOn && fmPlayer && fmPlayer.setVolume) { try { fmPlayer.setVolume(Math.round(radioVol * 18)); } catch (_) {} }
            document.body.classList.add('in-dialogue');
            $('prompt').style.display = 'none';
            $('dialogue').style.display = 'block';
            attemptWrong = false;
            renderQuestion();
        }
        function renderQuestion() {
            const p = PASSENGERS[curIdx];
            $('dlg-badge').textContent = 'Passenger ' + (curIdx + 1) + ' of ' + PASSENGERS.length + '  -  ' + NGS.label;
            $('dlg-name').textContent = p.name + ' (' + p.role + ', ' + p.stop + ')';
            $('dlg-text').textContent = p.line;
            const box = $('dlg-choices'); box.innerHTML = '';
            shuffle(p.options.slice()).forEach((o, i) => {
                const b = document.createElement('button'); b.className = 'choice-btn';
                const tag = document.createElement('b'); tag.textContent = String.fromCharCode(65 + i) + '. ';
                b.appendChild(tag); b.appendChild(document.createTextNode(o.text));
                b.addEventListener('click', () => choose(o));
                box.appendChild(b);
            });
            $('dialogue').scrollTop = 0;
        }
        function choose(o) {
            const p = PASSENGERS[curIdx];
            const box = $('dlg-choices'); box.innerHTML = '';
            const btn = document.createElement('button');
            if (o.correct) {
                const bonus = attemptWrong ? 100 : 250 + Math.min(streak, 3) * 50;
                if (!attemptWrong) streak++;
                impactScore += bonus; onboarded++; kitCoins += 25;
                updateHud(); sfxGood();
                $('dlg-text').textContent = p.thanks + '\n\n+' + bonus + ' pts and +25 $KIT\nT3Kit tip: ' + p.tip;
                btn.className = 'choice-btn primary'; btn.textContent = 'WELCOME ABOARD, CONTINUE DRIVING';
                btn.addEventListener('click', () => closeDialogue(true));
            } else {
                streak = 0; attemptWrong = true; sfxBad();
                $('dlg-text').textContent = 'Hmm... ' + o.feedback;
                btn.className = 'choice-btn primary'; btn.textContent = 'TRY AGAIN';
                btn.addEventListener('click', renderQuestion);
            }
            box.appendChild(btn);
        }
        function closeDialogue(ok) {
            if (fmOn && fmPlayer && fmPlayer.setVolume) { try { fmPlayer.setVolume(Math.round(radioVol * 100)); } catch (_) {} }
            $('dialogue').style.display = 'none';
            document.body.classList.remove('in-dialogue');
            state.dialogue = false;
            if (ok) {
                PASSENGERS[curIdx].leaving = true; sfxDoor();
                delivered++; curIdx++;
                updateHud(); setTarget();
                toast(curIdx < PASSENGERS.length ? 'Next: ' + PASSENGERS[curIdx].name + ' at ' + PASSENGERS[curIdx].stop : 'All aboard! Head to KitCity');
            }
        }

        function updateHud() {
            $('passenger-count').textContent = delivered + ' / ' + PASSENGERS.length;
            $('impact-score').textContent = impactScore + ' pts';
            $('learner-count').textContent = onboarded;
            $('kit-count').textContent = kitCoins;
        }

        function recover() {
            if (!state.started || state.dialogue || state.ended) return;
            const z = target ? Math.min(START_Z, target.z + 70) : car.z;
            car.x = 11.5; car.z = z; car.h = 0; car.speed = 0; car.steer = 0; laneX = isTouch ? 11.5 : null;
            snapCamera = true;
            toast('Back on the road');
        }

        function finishGame() {
            state.ended = true;
            const vibeBonus = Math.round(vibe) * 2; impactScore += vibeBonus;
            const mr = missionResult(); impactScore += mr.bonus; updateHud();
            $('end-mission').innerHTML = '<b style="color:' + (mr.ok ? '#2ecc71' : '#e67e22') + '">' + (mr.ok ? 'MISSION COMPLETE' : 'MISSION INCOMPLETE') + ': ' + (MC.name || '') + '</b><br>' + mr.notes.join(' · ') + '<br>Mission bonus +' + mr.bonus;
            releaseTouch();
            const mins = Math.floor(elapsed / 60), secs = Math.floor(elapsed % 60);
            $('e-score').textContent = impactScore;
            $('e-learners').textContent = onboarded;
            $('e-kit').textContent = kitCoins;
            $('e-time').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
            $('e-crash').textContent = collisions;
            $('e-pax').textContent = delivered; $('e-vibe').textContent = '+' + vibeBonus;
            const stars = (mr.ok && impactScore >= 1900) ? 3 : impactScore >= 1200 ? 2 : 1;
            $('end-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
            $('end-msg').textContent = 'You arrived at KitCity from ' + NGS.city + '. You delivered ' + delivered + ' passengers and helped ' + onboarded + ' people take their first safe steps into Web3. Your next city journey starts here.';
            markVisited(NGS.id);
            sfxGood();
            setTimeout(() => { $('end').style.display = 'flex'; }, 900);
        }

        $('btn-start').addEventListener('click', () => {
            initAudio(); initStreet();
            $('start').style.display = 'none';
            state.started = true;
            toast('Follow the arrow to your first passenger');
        });
        $('btn-again').addEventListener('click', () => restartGame(NGS.id));

        // ============================================================
        // 11. CAR PHYSICS
        // ============================================================
        let throttleIn = 0, brakeIn = 0, handbrake = false, hornOn = false, braking = false;
        // lane assist (touch): swipe picks the lane, the car aligns itself
        const PLAYER_LANES = [-11.5, -4.5, 4.5, 11.5];
        let laneX = null;
        function nearestLane(x) { let b = 0; PLAYER_LANES.forEach((l, i) => { if (Math.abs(l - x) < Math.abs(PLAYER_LANES[b] - x)) b = i; }); return b; }
        function changeLane(dir) {
            if (!state.started || state.ended || state.dialogue) return;
            const cur = laneX === null ? nearestLane(car.x) : PLAYER_LANES.indexOf(laneX);
            const nx = Math.max(0, Math.min(PLAYER_LANES.length - 1, cur + dir));
            laneX = PLAYER_LANES[nx];
        }
        function laneSteer() {
            const v = car.speed;
            if (v < 0.8) return 0;
            const ex = laneX - car.x;
            const hDes = -clamp(1.5 * ex / Math.max(v, 6), -0.4, 0.4);
            return clamp((car.h - hDes) * 4.5, -1, 1);
        }

        function readInput(dt) {
            const up = keys['w'] || keys['arrowup'] || touch.gas;
            const down = keys['s'] || keys['arrowdown'] || touch.brake;
            const reverse = keys['v'] || touch.reverse;
            handbrake = !!keys[' '];
            throttleIn = up && !down && !reverse ? 1 : 0; brakeIn = down ? 1 : 0; reverseIn = reverse && !down ? 1 : 0;
            let tgt;
            if (isTouch && laneX !== null) tgt = laneSteer();
            else tgt = ((keys['d'] || keys['arrowright']) ? 1 : 0) - ((keys['a'] || keys['arrowleft']) ? 1 : 0);
            car.steerIn += (tgt - car.steerIn) * Math.min(1, dt * ((isTouch && laneX !== null) ? 20 : (tgt === 0 ? 10 : 5)));
            hornOn = kbHorn || touch.horn;
        }

        function updateCar(dt) {
            const maxR = -12;
            car.prevSpeed = car.speed;
            braking = false;

            if (brakeIn) {
                if (car.speed > 0.4) { car.speed -= 48 * dt; braking = true; }
                else if (car.speed < 0) car.speed = Math.min(0, car.speed + 58 * dt);
                else car.speed = 0;
            } else if (reverseIn) {
                if (car.speed > 0.4) { car.speed -= 58 * dt; braking = true; }
                else car.speed = Math.max(maxR, car.speed - 20 * dt);
            } else if (handbrake) {
                braking = car.speed > 0.4;
                if (car.speed > 0) car.speed = Math.max(0, car.speed - 50 * dt);
                else car.speed = Math.min(0, car.speed + 50 * dt);
            } else if (throttleIn) {
                if (car.speed < 0) car.speed += 42 * dt;
                else car.speed += (24 * Math.pow(1 - car.speed / MAX_V, 0.7) + 2) * dt;
            } else {
                const drag = (1.4 + car.speed * car.speed * 0.004) * dt;
                if (car.speed > 0) car.speed = Math.max(0, car.speed - drag);
                else if (car.speed < 0) car.speed = Math.min(0, car.speed + drag);
            }
            car.speed = clamp(car.speed, maxR, MAX_V);
            if (MS.noPower) car.speed = Math.min(car.speed, 7);

            const maxSteer = 0.6 / (1 + Math.abs(car.speed) / 10);
            car.steer += (car.steerIn * maxSteer - car.steer) * Math.min(1, dt * 10);
            const L = 4.0;
            car.yawRate = -(car.speed / L) * Math.tan(car.steer);
            car.h += car.yawRate * dt;

            car.x += -Math.sin(car.h) * car.speed * dt;
            car.z += -Math.cos(car.h) * car.speed * dt;

            if (hopCooldown > 0) hopCooldown -= dt;
            const hopPressed = touch.hop || keys['j'];
            if (hopPressed && hopCooldown <= 0 && Math.abs(car.speed) > 3 && !state.dialogue) { hopT = 0.58; hopCooldown = 0.85; }
            if (hopT > 0) { hopT -= dt; const p = 1 - hopT / 0.58; hopY = Math.sin(p * Math.PI) * 0.9; } else hopY = 0;

            const lim = roadLimit(car.z);
            if (car.x > lim) { car.x = lim; car.speed *= (1 - 1.2 * dt); }
            if (car.x < -lim) { car.x = -lim; car.speed *= (1 - 1.2 * dt); }
            if (car.z > START_Z + 60) { car.z = START_Z + 60; car.speed *= 0.9; }
            if (car.z < END_Z + 10) { car.z = END_Z + 10; car.speed *= 0.5; }
        }

        // ============================================================
        // 12. RADAR, NAV, CAMERA
        // ============================================================
        const rc = $('radar'), rg = rc.getContext('2d');
        function drawRadar() {
            const S = rc.width, c = S / 2, scale = c / 95;
            const sh = Math.sin(car.h), ch = Math.cos(car.h);
            const toScr = (x, z) => {
                const dx = x - car.x, dz = z - car.z;
                return [c + (dx * ch - dz * sh) * scale, c - (-dx * sh - dz * ch) * scale];
            };
            rg.clearRect(0, 0, S, S);
            rg.save(); rg.beginPath(); rg.arc(c, c, c - 2, 0, Math.PI * 2); rg.clip();
            rg.fillStyle = '#2c3a24'; rg.fillRect(0, 0, S, S);
            rg.fillStyle = '#4a4a52'; rg.beginPath();
            [[-ROAD_HALF, car.z + 160], [ROAD_HALF, car.z + 160], [ROAD_HALF, car.z - 160], [-ROAD_HALF, car.z - 160]].forEach((p, i) => {
                const q = toScr(p[0], p[1]); if (i) rg.lineTo(q[0], q[1]); else rg.moveTo(q[0], q[1]);
            });
            rg.closePath(); rg.fill();
            rg.strokeStyle = '#f5b014'; rg.lineWidth = 2; rg.beginPath();
            const a = toScr(0, car.z + 160), b = toScr(0, car.z - 160); rg.moveTo(a[0], a[1]); rg.lineTo(b[0], b[1]); rg.stroke();
            traffic.forEach(t => {
                const q = toScr(t.x, t.z);
                rg.fillStyle = t.same ? '#e0e0e0' : '#e74c3c';
                rg.fillRect(q[0] - 3, q[1] - 3, 6, 6);
            });
            rg.fillStyle = '#ffd24a';
            coinSpots.forEach(c => { if (c.mesh && !c.got) { const q = toScr(c.x, c.z); rg.fillRect(q[0] - 1.5, q[1] - 1.5, 3, 3); } });
            rg.fillStyle = '#ff6bd6';
            hawkers.forEach(h => { if (h.g.visible) { const q = toScr(h.x, h.z); rg.beginPath(); rg.arc(q[0], q[1], 3, 0, Math.PI * 2); rg.fill(); } });
            rg.fillStyle = '#ffa733';
            crossers.forEach(c => { if (c.active) { const q = toScr(c.x, c.z); if (c.type === 'cart') rg.fillRect(q[0] - 6, q[1] - 3, 12, 6); else { rg.beginPath(); rg.arc(q[0], q[1], 3.5, 0, Math.PI * 2); rg.fill(); } } });
            if (target) {
                const q = toScr(target.x, target.z);
                let tx = q[0], ty = q[1];
                const vx = tx - c, vy = ty - c, len = Math.hypot(vx, vy), maxLen = c - 16;
                rg.fillStyle = target.type === 'pax' ? '#00e5ff' : '#2ecc71';
                if (len > maxLen) {
                    tx = c + vx / len * maxLen; ty = c + vy / len * maxLen;
                    rg.beginPath(); rg.arc(tx, ty, 8, 0, Math.PI * 2); rg.fill();
                    rg.fillStyle = '#000'; rg.font = 'bold 12px Arial'; rg.textAlign = 'center'; rg.textBaseline = 'middle'; rg.fillText('!', tx, ty + 1);
                } else {
                    rg.globalAlpha = 0.5; rg.beginPath(); rg.arc(tx, ty, 10, 0, Math.PI * 2); rg.fill(); rg.globalAlpha = 1;
                    rg.beginPath(); rg.arc(tx, ty, 5, 0, Math.PI * 2); rg.fill();
                }
            }
            rg.fillStyle = '#00e5ff'; rg.beginPath(); rg.moveTo(c, c - 11); rg.lineTo(c + 7, c + 9); rg.lineTo(c - 7, c + 9); rg.closePath(); rg.fill();
            rg.restore();
        }

        function updateNav(dt) {
            if (!target) return;
            const dx = target.x - car.x, dz = target.z - car.z;
            const sh = Math.sin(car.h), ch = Math.cos(car.h);
            const relR = dx * ch - dz * sh;
            const relF = -dx * sh - dz * ch;
            const dist = Math.hypot(dx, dz);
            if (hudAcc > 0.1) {
                hudAcc = 0;
                $('arrow-wrap').style.transform = 'rotate(' + (Math.atan2(relR, relF) * 180 / Math.PI) + 'deg)';
                $('obj-text').innerHTML = '<b>' + target.title + '</b><br>' + target.sub + ' · <span id="obj-dist">' + Math.round(dist) + ' m</span>';
                const prog = clamp((START_Z - car.z) / (START_Z - TERMINAL_Z), 0, 1);
                $('progress').firstElementChild.style.width = (prog * 100) + '%';
                $('speed-val').textContent = Math.round(Math.abs(car.speed) * 3.6);
                $('vibe-val').textContent = Math.round(vibe) + '%'; $('vibe-bar').style.width = vibe + '%'; missionHud();
                const sb = $('speed-bar').firstElementChild;
                sb.style.width = (Math.abs(car.speed) / MAX_V * 100) + '%';
                sb.style.background = car.speed < -0.2 ? '#e67e22' : '#2ecc71';
            }

            const pr = $('prompt');
            if (state.started && !state.dialogue && !state.ended && target.type === 'pax' && dist < ZONE_R) {
                pr.style.display = 'block';
                const slow = Math.abs(car.speed) > 5;
                pr.classList.toggle('slow', slow);
                const label = slow ? 'SLOW DOWN TO PICK UP' : 'PICK UP ' + PASSENGERS[curIdx].name.toUpperCase();
                if (pr.textContent !== label) pr.textContent = label;
            } else pr.style.display = 'none';

            if (state.started && !state.ended && target.type === 'terminal' && dist < 16 && Math.abs(car.speed) < 5) finishGame();

            missedCD -= dt;
            if (state.started && !state.dialogue && target.type === 'pax' && car.z < target.z - 50 && missedCD <= 0) {
                toast('You passed the stop. Turn around or tap ↺');
                missedCD = 14;
            }
        }

        const camPos = new THREE.Vector3(), tmpV = new THREE.Vector3(), lookV = new THREE.Vector3();
        function updateCamera(dt) {
            const sh = Math.sin(car.h), ch = Math.cos(car.h);
            shake *= Math.exp(-dt * 5);
            const sx = (Math.random() - 0.5) * shake * 0.6, sy = (Math.random() - 0.5) * shake * 0.6;
            if (camMode === 'fp') {
                danfo.updateMatrixWorld(true);
                camera.position.copy(danfo.localToWorld(tmpV.set(-0.7, 2.35, -1.3)));
                camera.position.x += sx; camera.position.y += sy;
                lookV.copy(danfo.localToWorld(tmpV.set(-0.7 + car.steer * 3, 2.1, -22)));
                camera.lookAt(lookV);
                camera.fov += (74 - camera.fov) * Math.min(1, dt * 3);
            } else {
                const dist = 11.5 + Math.abs(car.speed) * 0.1;
                tmpV.set(car.x + sh * dist, 4.8, car.z + ch * dist);
                if (snapCamera) { camPos.copy(tmpV); snapCamera = false; }
                else camPos.lerp(tmpV, 1 - Math.exp(-dt * 9));
                camera.position.set(camPos.x + sx, camPos.y + sy, camPos.z);
                lookV.set(car.x - sh * 8, 1.8, car.z - ch * 8);
                camera.lookAt(lookV);
                camera.fov += ((60 + Math.abs(car.speed) * 0.55) - camera.fov) * Math.min(1, dt * 3);
            }
            camera.updateProjectionMatrix();
        }

        // ============================================================
        // 14. ROAD LIFE: $KIT coins, pedestrians, hawkers, truck pushers
        // ============================================================
        let kitCoins = 0, coinCombo = 0, coinComboT = 0, peopleCD = 0, jamHornT = 0, crossT = 1.5;

        // ----- shared look -----
        const _lm = {};
        function lam(c) { return _lm[c] || (_lm[c] = new THREE.MeshLambertMaterial({ color: c })); }
        const PG = {
            leg: new THREE.BoxGeometry(0.2, 0.8, 0.22).translate(0, -0.4, 0),
            arm: new THREE.BoxGeometry(0.14, 0.62, 0.14).translate(0, -0.29, 0),
            torso: new THREE.CylinderGeometry(0.28, 0.32, 0.78, 10),
            head: new THREE.SphereGeometry(0.23, 10, 8),
            hair: new THREE.SphereGeometry(0.245, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2),
            gele: new THREE.SphereGeometry(0.3, 10, 6),
            skirt: new THREE.CylinderGeometry(0.3, 0.46, 0.75, 10),
            cap: new THREE.CylinderGeometry(0.25, 0.27, 0.1, 10),
            bowl: new THREE.CylinderGeometry(0.42, 0.3, 0.14, 12),
            orange: new THREE.SphereGeometry(0.11, 8, 6),
            bottle: new THREE.CylinderGeometry(0.06, 0.06, 0.34, 6),
            box: new THREE.BoxGeometry(1, 1, 1),
            wheel: new THREE.CylinderGeometry(0.55, 0.55, 0.12, 14).rotateZ(Math.PI / 2)
        };
        PG.robe = new THREE.CylinderGeometry(0.31, 0.46, 1.35, 12); PG.beads = new THREE.TorusGeometry(0.22, 0.035, 6, 12);
        PG.hijab = new THREE.SphereGeometry(0.265, 10, 8); PG.drape = new THREE.CylinderGeometry(0.3, 0.4, 0.5, 10);
        PG.kufi = new THREE.CylinderGeometry(0.2, 0.22, 0.17, 10); PG.fila = new THREE.SphereGeometry(0.27, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2);
        PG.turban = new THREE.SphereGeometry(0.29, 10, 8); PG.fulani = new THREE.ConeGeometry(0.5, 0.3, 12);
        PG.beanie = new THREE.SphereGeometry(0.255, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2); PG.red = new THREE.CylinderGeometry(0.22, 0.25, 0.2, 10);
        const PED_SHIRTS = [0xe74c3c, 0x3498db, 0xf1c40f, 0x9b59b6, 0x1abc9c, 0xe67e22, 0xecf0f1, 0x2ecc71, 0xd35400];
        const PED_SKIN = [0x3d2a1c, 0x4a3525, 0x5a3a28, 0x6b4630, 0x4e3322, 0x2e1d12];

        function makePerson(o) {
            const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
            body.scale.setScalar(o.scale || 1);
            const skin = lam(o.skin), shirt = lam(o.shirt), pants = lam(o.pants || 0x222831);
            const legL = new THREE.Mesh(PG.leg, o.skirt ? skin : pants); legL.position.set(-0.13, 0.82, 0);
            const legR = new THREE.Mesh(PG.leg, o.skirt ? skin : pants); legR.position.set(0.13, 0.82, 0);
            const torso = new THREE.Mesh(PG.torso, shirt); torso.position.y = 1.2;
            const head = new THREE.Mesh(PG.head, skin); head.position.y = 1.83;
            const armL = new THREE.Mesh(PG.arm, skin); armL.position.set(-0.4, 1.52, 0);
            const armR = new THREE.Mesh(PG.arm, skin); armR.position.set(0.4, 1.52, 0);
            body.add(legL); body.add(legR); body.add(torso); body.add(head); body.add(armL); body.add(armR);
            if (o.skirt) { const sk = new THREE.Mesh(PG.skirt, lam(o.skirt)); sk.position.y = 0.72; body.add(sk); }
            if (o.robe) { const rb = new THREE.Mesh(PG.robe, lam(o.robe)); rb.position.y = 0.95; body.add(rb); }
            if (o.beads) { const bd = new THREE.Mesh(PG.beads, lam(o.beads)); bd.position.y = 1.52; bd.rotation.x = Math.PI / 2; body.add(bd); }
            if (o.hijab) { const hj = new THREE.Mesh(PG.hijab, lam(o.hijab)); hj.position.y = 1.86; hj.scale.set(1, 1.1, 1); body.add(hj); const dr = new THREE.Mesh(PG.drape, lam(o.hijab)); dr.position.y = 1.5; body.add(dr); }
            else if (o.headtie) { const gl = new THREE.Mesh(PG.gele, lam(o.headtie)); gl.position.y = 1.97; gl.scale.set(1, 0.65, 1); body.add(gl); }
            else if (o.capKind) { const ck = o.capKind, cp = new THREE.Mesh(PG[ck] || PG.cap, lam(o.cap || 0xffffff)); cp.position.y = ck === 'fulani' ? 2.02 : ck === 'turban' ? 1.98 : ck === 'fila' ? 1.95 : ck === 'beanie' ? 1.9 : ck === 'red' ? 2.02 : 2.03; if (ck === 'fila') cp.rotation.z = 0.35; body.add(cp); }
            else if (o.cap) { const cp = new THREE.Mesh(PG.cap, lam(o.cap)); cp.position.y = 2.03; body.add(cp); }
            else { const hr = new THREE.Mesh(PG.hair, lam(0x111111)); hr.position.y = 1.84; body.add(hr); }
            const ud = { body: body, legL: legL, legR: legR, armL: armL, armR: armR, goods: null, armsLocked: false, waveArm: null };

            if (o.prop) {
                const goods = new THREE.Group(); body.add(goods); ud.goods = goods;
                if (o.prop === 'bowl') {
                    goods.position.y = 2.12;
                    goods.add(new THREE.Mesh(PG.bowl, lam(0xe8e8e8)));
                    if (o.goods === 'orange') {
                        for (let i = 0; i < 7; i++) {
                            const m = new THREE.Mesh(PG.orange, lam(0xf39c12));
                            m.position.set(Math.cos(i * 0.9) * 0.2 * (i > 0 ? 1 : 0), 0.13 + (i > 3 ? 0.13 : 0), Math.sin(i * 0.9) * 0.2 * (i > 0 ? 1 : 0)); goods.add(m);
                        }
                    } else {
                        for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) {
                            const m = new THREE.Mesh(PG.box, lam((i + j) % 2 ? 0xdff6ff : 0x9fd8f5));
                            m.scale.set(0.22, 0.14, 0.34); m.position.set((j - 1) * 0.24, 0.14 + i * 0.15, 0); goods.add(m);
                        }
                    }
                    armL.rotation.z = 2.7; armR.rotation.z = -2.7; ud.armsLocked = true;
                } else if (o.prop === 'rack') {
                    goods.position.set(0, 1.12, 0.55);
                    const bd = new THREE.Mesh(PG.box, lam(0x8b5a2b)); bd.scale.set(0.95, 0.05, 0.5); goods.add(bd);
                    [0xe74c3c, 0xf1c40f, 0x3498db, 0x2ecc71].forEach((c, i) => {
                        const m = new THREE.Mesh(PG.box, lam(c)); m.scale.set(0.18, 0.12, 0.14); m.position.set((i - 1.5) * 0.22, 0.09, (i % 2) * 0.1 - 0.05); goods.add(m);
                    });
                    armL.rotation.x = -1.25; armR.rotation.x = -1.25; ud.armsLocked = true;
                } else {                                      // bottles in one hand, other arm waving
                    goods.position.set(0.46, 0.78, 0.06);
                    [0xff6b6b, 0x74b9ff, 0xfdcb6e, 0x55efc4, 0xa29bfe].forEach((c, i) => {
                        const m = new THREE.Mesh(PG.bottle, lam(c)); m.position.set((i - 2) * 0.07, 0, (i % 2) * 0.06); goods.add(m);
                    });
                    ud.waveArm = armL;
                }
            }
            g.userData = ud;
            return g;
        }
        function randPerson(prop, goods) {
            const o = kitOpts(V.kit, Math.random() < 0.45 ? 'f' : 'm'); o.prop = prop; o.goods = goods; return makePerson(o);
        }
        function animWalk(ud, ph, amp) {
            ud.legL.rotation.x = Math.sin(ph) * amp; ud.legR.rotation.x = -Math.sin(ph) * amp;
            if (!ud.armsLocked) {
                ud.armL.rotation.x = -Math.sin(ph) * amp * 0.7;
                ud.armR.rotation.x = ud.waveArm ? 0 : Math.sin(ph) * amp * 0.7;
            }
        }
        function setDown(ud, on, side) {
            if (!ud.body) return;
            ud.body.rotation.z = on ? (side || 1) * Math.PI / 2 : 0;
            ud.body.position.y = on ? 0.3 : 0;
            if (ud.goods) ud.goods.visible = !on;
        }

        // Does a circle on the ground overlap the danfo's footprint?
        function carRectHit(wx, wz, r) {
            const sh = Math.sin(car.h), ch = Math.cos(car.h);
            const dx = wx - car.x, dz = wz - car.z;
            const lx = dx * ch - dz * sh, lz = -dx * sh - dz * ch;
            const ex = Math.max(Math.abs(lx) - 1.3, 0), ez = Math.max(Math.abs(lz) - 3.2, 0);
            return ex * ex + ez * ez < r * r;
        }
        function pedestrianCall(c) {
            // Ambient pedestrian voices intentionally disabled; keep the visual crossing behavior.
            return false;
            if (typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined' || muted) return false;
            if (speechSynthesis.speaking || speechSynthesis.pending) return false;
            const lines = [
                'Oga, easy! Watch the road!',
                'Driver, abeg! Give me small space!',
                'Omo! Make I cross first!',
                'Abeg, slow down!'
            ];
            try {
                const u = new SpeechSynthesisUtterance(pick(lines));
                u.lang = ttsVoice ? ttsVoice.lang : 'en-NG';
                u.volume = fmOn && radioPlaying ? 0.48 : 0.58;
                u.rate = rand(0.94, 1.04);
                u.pitch = rand(0.9, 1.08);
                if (fmOn && fmPlayer && fmPlayer.setVolume) { try { fmPlayer.setVolume(Math.round(radioVol * 100 * 0.42)); } catch (_) {} }
                u.onend = () => { if (fmOn && fmPlayer && fmPlayer.setVolume) { try { fmPlayer.setVolume(Math.round(radioVol * 100)); } catch (_) {} } };
                speechSynthesis.resume();
                speechSynthesis.speak(u);
                return true;
            } catch (_) { return false; }
        }

        function pedestrianAbuse(speed) {
            // No spoken pedestrian reactions; preserve the on-screen collision feedback.
            return Math.abs(speed) > 12 ? 'Watch the road!' : 'Drive carefully!';
        }
        function peopleImpact(pts, speedMul, msg) {
            peopleCD = 1.2; collisions++; mHit(6);
            impactScore = Math.max(0, impactScore - pts);
            car.speed *= speedMul;
            shake = 0.8; vibe = Math.max(0, vibe - 10);
            updateHud();
            const f = $('flash'); f.classList.add('on'); setTimeout(() => f.classList.remove('on'), 80);
            sfxThump(); sfxYelp();
            toast(msg);
        }

        // ============================================================
        // $KIT coins
        // ============================================================
        const coinTex = (function () {
            const c = document.createElement('canvas'); c.width = c.height = 128;
            const g = c.getContext('2d');
            g.fillStyle = '#f5b014'; g.beginPath(); g.arc(64, 64, 62, 0, Math.PI * 2); g.fill();
            g.fillStyle = '#00141a'; g.beginPath(); g.arc(64, 64, 52, 0, Math.PI * 2); g.fill();
            g.strokeStyle = '#00e5ff'; g.lineWidth = 5; g.beginPath(); g.arc(64, 64, 44, 0, Math.PI * 2); g.stroke();
            g.fillStyle = '#00e5ff'; g.font = 'bold 60px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('K', 64, 68);
            return new THREE.CanvasTexture(c);
        })();
        const coinGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.14, 24).rotateX(Math.PI / 2);
        const coinMats = [new THREE.MeshBasicMaterial({ color: 0xf5b014 }), new THREE.MeshBasicMaterial({ map: coinTex }), new THREE.MeshBasicMaterial({ map: coinTex })];
        const coinFree = [];
        for (let i = 0; i < 70; i++) { const m = new THREE.Mesh(coinGeo, coinMats); m.visible = false; scene.add(m); coinFree.push(m); }

        const coinSpots = [];
        (function genCoins() {
            // Sparse rewards: one easy-to-read coin roughly every 55–70m.
            // Extra coins are reserved for passenger stops and jump barriers.
            let z = START_Z - 90;
            const add = (x, zz) => coinSpots.push({ x, z: zz, got: false, mesh: null, ph: Math.random() * 6 });
            while (z > END_Z + 90) {
                add(pick([4.5, 8, 11.5]), z);
                z -= rand(55, 70);
            }
            STOPS.forEach(sz => add(11.5, sz - 24));
        })();

        function collectCoin(c) {
            c.got = true; coinFree.push(c.mesh); c.mesh.visible = false; c.mesh = null;
            kitCoins++; impactScore += 2;
            coinCombo = coinComboT > 0 ? coinCombo + 1 : 0; coinComboT = 1.2;
            sfxCoin(coinCombo); updateHud();
            const k = $('kit-count'); k.classList.remove('pop'); void k.offsetWidth; k.classList.add('pop');
        }
        function updateCoins(dt, active) {
            coinComboT = Math.max(0, coinComboT - dt);
            const sh = Math.sin(car.h), ch = Math.cos(car.h);
            for (let i = 0; i < coinSpots.length; i++) {
                const c = coinSpots[i];
                if (c.got) continue;
                const dz = c.z - car.z;
                if (dz < -260 || dz > 40) { if (c.mesh) { c.mesh.visible = false; coinFree.push(c.mesh); c.mesh = null; } continue; }
                if (!c.mesh) { if (!coinFree.length) continue; c.mesh = coinFree.pop(); c.mesh.visible = true; }
                c.mesh.position.set(c.x, 1.35 + Math.sin(time * 3 + c.ph) * 0.14, c.z);
                c.mesh.rotation.y = time * 3.2 + c.ph;
                if (active) {
                    const dx = c.x - car.x;
                    const lx = dx * ch - dz * sh, lz = -dx * sh - dz * ch;
                    if (Math.abs(lx) < 2.1 && Math.abs(lz) < 3.8) collectCoin(c);
                }
            }
        }

        // ============================================================
        // Jumpable roadside barriers — placed in the drivable lanes with nearby coin trails.
        const barrierMat = new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.65 });
        const barrierGeo = new THREE.BoxGeometry(2.2, 0.9, 1.2);
        const barriers = [];
        for (let z = START_Z - 240; z > END_Z + 120; z -= rand(115, 175)) {
            const x = pick([4.5, 8, 11.5]);
            const g = new THREE.Mesh(barrierGeo, barrierMat); g.position.set(x, 0.45, z); g.castShadow = true; scene.add(g);
            barriers.push({ x, z, g, hit: false });
            coinSpots.push({ x, z: z - 10, got:false, mesh:null, ph:Math.random()*6 });
            coinSpots.push({ x: x === 4.5 ? 8 : 4.5, z: z - 18, got:false, mesh:null, ph:Math.random()*6 });
        }
        function updateBarriers(active) {
            for (const b of barriers) {
                b.g.visible = b.z > car.z - 260 && b.z < car.z + 55;
                if (!active || b.hit) continue;
                const dx = b.x - car.x, dz = b.z - car.z;
                if (Math.abs(dx) < 2.4 && Math.abs(dz) < 3.1 && hopY < 0.28) {
                    b.hit = true; b.g.visible = false; car.speed *= 0.45; impactScore = Math.max(0, impactScore - 12); shake = 0.35;
                    toast('Barrier hit! Hop over the road blocks. -12 pts');
                    sfxThump(); updateHud();
                }
            }
        }

        // ============================================================
        // Crossing pedestrians and truck pushers
        // ============================================================
        function makeCart() {
            const g = new THREE.Group(), bob = new THREE.Group(); g.add(bob);
            const wood = lam(0x8b5a2b);
            const part = (mat, sx, sy, sz, x, y, z) => { const m = new THREE.Mesh(PG.box, mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); bob.add(m); return m; };
            part(wood, 1.5, 0.18, 3.2, 0, 0.95, 0);
            part(wood, 0.08, 0.4, 3.2, -0.75, 1.2, 0); part(wood, 0.08, 0.4, 3.2, 0.75, 1.2, 0); part(wood, 1.5, 0.4, 0.08, 0, 1.2, 1.6);
            part(lam(0x5a3a1a), 0.07, 0.07, 1.8, -0.55, 1.05, -2.5); part(lam(0x5a3a1a), 0.07, 0.07, 1.8, 0.55, 1.05, -2.5);
            const wheels = [-0.88, 0.88].map(x => { const w = new THREE.Mesh(PG.wheel, lam(0x1b1b1b)); w.position.set(x, 0.55, 0.3); g.add(w); return w; });
            const cols = [0xc8a165, 0xa5764a, 0xe8e2d0, 0x3b6ea5, 0x2e8b57, 0xb33939];
            const n = 4 + Math.floor(Math.random() * 3);
            for (let i = 0; i < n; i++) {
                const h = rand(0.5, 1.0);
                part(lam(pick(cols)), rand(0.5, 0.75), h, rand(0.6, 1.0), rand(-0.4, 0.4), 1.04 + h / 2 + (i > 3 ? 0.55 : 0), -1.1 + i * 0.5 - (i > 3 ? 2 : 0));
            }
            const pushers = [-0.5, 0.5].map(x => {
                const p = randPerson(null);
                p.position.set(x, 0, -3.0); p.userData.body.rotation.x = 0.35;
                p.userData.armL.rotation.x = -1.2; p.userData.armR.rotation.x = -1.2; p.userData.armsLocked = true;
                g.add(p); return p;
            });
            g.userData = { bob: bob, wheels: wheels, pushers: pushers };
            return g;
        }
        const CART_HIT = [[-3.0, 0.6], [-1.2, 1.0], [0, 1.0], [1.2, 1.0]];

        const crossers = [];
        function addCrosser(type) {
            const g = type === 'cart' ? makeCart() : randPerson(null);
            g.visible = false; scene.add(g);
            crossers.push({ type: type, g: g, active: false, dir: 1, v: 1.5, x: 0, z: 0, ph: 0, down: 0, hurry: 1, stun: 0, grace: 0, called: false, side: 1 });
        }
        for (let i = 0; i < 5; i++) addCrosser('ped');
        addCrosser('cart');

        function startCrosser(c, dir, z, xOff) {
            c.active = true; c.dir = dir; c.z = z; c.x = -dir * (19.5 + rand(0, 2) + xOff);
            const r = Math.random();
            if (c.type === 'cart') c.v = rand(0.95, 1.35);
            else c.v = r < 0.65 ? rand(1.4, 1.9) : r < 0.9 ? rand(2.4, 3.0) : rand(4.0, 5.0);
            c.down = 0; c.hurry = 1; c.stun = 0; c.grace = 0; c.called = false; c.ph = Math.random() * 6;
            setDown(c.g.userData, false);
            c.g.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
            c.g.visible = true;
        }
        function spawnCrossGroup() {
            const z = car.z - (85 + Math.abs(car.speed) * 2.6) - rand(0, 60);
            if (z < END_Z + 50) return;
            const dir = Math.random() < 0.5 ? -1 : 1;
            if (Math.random() < 0.3) {
                const cart = crossers.find(c => c.type === 'cart' && !c.active);
                if (cart) { startCrosser(cart, dir, z, 0); return; }
            }
            const n = pick([1, 1, 2, 3]);
            for (let i = 0; i < n; i++) {
                const c = crossers.find(c => c.type === 'ped' && !c.active);
                if (!c) break;
                startCrosser(c, dir, z - i * rand(1.4, 2.2), i * rand(0.6, 1.2));
            }
        }
        function crosserBlocks(c, t) {
            const dz = t.same ? t.z - c.z : c.z - t.z;       // positive when the crosser is ahead of this car
            if (dz < -1 || dz > 15) return false;
            if (c.type === 'cart') { const a = c.x - c.dir * 3.6, b = c.x + c.dir * 2.2; return t.x > Math.min(a, b) - 1.6 && t.x < Math.max(a, b) + 1.6; }
            return Math.abs(c.x - t.x) < 2.2;
        }

        function updateCrossers(dt, active) {
            if (active) {
                crossT -= dt;
                if (crossT <= 0) { crossT = rand(3.5, 7); spawnCrossGroup(); }
            }
            for (let i = 0; i < crossers.length; i++) {
                const c = crossers[i];
                if (!c.active) continue;
                const ud = c.g.userData;
                if (c.grace > 0) c.grace -= dt;
                if (c.type === 'ped') {
                    if (c.down > 0) {
                        c.down -= dt;
                        if (c.down <= 0) { setDown(ud, false); c.hurry = 1.8; }
                    } else {
                        const dzF = car.z - c.z;                     // positive when the pedestrian is ahead of the danfo
                        const danger = car.speed > 5 && dzF > 0 && dzF < 6 + car.speed * 0.7 && Math.abs(c.x - car.x) < 5;
                        c.hurry += ((danger ? 2.2 : 1) - c.hurry) * Math.min(1, dt * 3);
                        const sp = c.v * c.hurry;
                        c.x += c.dir * sp * dt; c.ph += sp * dt * 2.6;
                        animWalk(ud, c.ph, clamp(0.35 + sp * 0.12, 0.4, 1.0));
                    }
                } else {
                    if (c.stun > 0) c.stun -= dt;
                    else {
                        c.x += c.dir * c.v * dt; c.ph += c.v * dt * 2.4;
                        ud.wheels.forEach(w => { w.rotation.x += c.dir * c.v * dt / 0.55; });
                        ud.pushers.forEach(p => animWalk(p.userData, c.ph, 0.5));
                    }
                    ud.bob.position.y = Math.sin(c.ph * 3) * 0.015;
                }
                c.g.position.set(c.x, 0.03, c.z);
                if ((c.dir > 0 && c.x > 23) || (c.dir < 0 && c.x < -23) || c.z > car.z + 70 || c.z < car.z - 420) {
                    c.active = false; c.g.visible = false; setDown(ud, false);
                    continue;
                }
                if (active && c.type === 'ped' && !c.called && Math.hypot(c.x - car.x, c.z - car.z) < 15) {
                    if (pedestrianCall(c)) c.called = true;
                }
                if (active && peopleCD <= 0) {
                    if (c.type === 'ped') {
                        if (c.down <= 0 && carRectHit(c.x, c.z, 0.42)) {
                            const sh = Math.sin(car.h), ch = Math.cos(car.h);
                            c.down = 2.3; setDown(ud, true, Math.random() < 0.5 ? 1 : -1);
                            c.x += -sh * 2; c.z += -ch * 2.5;
                            peopleImpact(40, 0.55, pedestrianAbuse(car.speed) + ' -40 pts');
                        }
                    } else if (c.grace <= 0) {
                        for (let k = 0; k < CART_HIT.length; k++) {
                            if (carRectHit(c.x + c.dir * CART_HIT[k][0], c.z, CART_HIT[k][1])) {
                                c.stun = 1.4; c.grace = 2.5;
                                car.speed = Math.min(car.speed, 2) * -0.15;
                                peopleImpact(60, 1, 'Truck pusher! Mind the cart! -60 pts');
                                break;
                            }
                        }
                    }
                }
            }
        }

        // ============================================================
        // Hawkers: roadside and in the middle of the road
        // ============================================================
        const HAWK_KINDS = [
            { prop: 'bowl', goods: 'water', phrase: 'Pure water! Omi tutu! Mmiri oyi! Ruwan sanyi! Oya buy am!' },
            { prop: 'bowl', goods: 'orange', phrase: 'Sweet oranges! Osan! Oroma di nma! Lemu mai dadi! Buy am!' },
            { prop: 'rack', goods: 'snack', phrase: 'Gala! Hot gala! Ewa, snack wa! Nri di oku! Abinci mai dadi!' },
            { prop: 'bottles', goods: 'drink', phrase: 'Cold zobo! Chapman! Mu mu zobo! Mmiri oyi! Oya take one!' }
        ];
        if (V.hawk) V.hawk.forEach((ph, i) => { if (ph) HAWK_KINDS[i].phrase = ph; });
        const HAWK_X = [0, 8, -8, 14.8, -14.8, 8, -8];       // median line, lane dividers, road edges
        const bubbleMats = {};
        function bubbleMat(text) {
            if (bubbleMats[text]) return bubbleMats[text];
            const c = document.createElement('canvas'); c.width = 512; c.height = 112;
            const g = c.getContext('2d'), w = 512, h = 112, r = 26;
            g.fillStyle = 'rgba(255,255,255,0.95)';
            g.beginPath(); g.moveTo(r, 6); g.arcTo(w - 6, 6, w - 6, h - 6, r); g.arcTo(w - 6, h - 6, 6, h - 6, r);
            g.arcTo(6, h - 6, 6, 6, r); g.arcTo(6, 6, w - 6, 6, r); g.closePath(); g.fill();
            g.strokeStyle = '#00e5ff'; g.lineWidth = 6; g.stroke();
            let fs = 52; g.font = 'bold ' + fs + 'px Arial';
            while (g.measureText(text).width > w - 50 && fs > 16) { fs -= 2; g.font = 'bold ' + fs + 'px Arial'; }
            g.fillStyle = '#10222a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2 + 2);
            return (bubbleMats[text] = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
        }

        // ----- Hawker voices: spoken calls, louder as you get close. Optional recorded clips hawk1..hawk4.mp3 win over speech. -----
        const HAWK_CLIPS = ['hawk1.mp3', 'hawk2.mp3', 'hawk3.mp3', 'hawk4.mp3'];
        const hawkClip = [null, null, null, null];           // null = not tried, false = missing, Audio = ready
        let ttsVoice = null;
        function pickVoice() {
            if (typeof speechSynthesis === 'undefined') return;
            const vs = speechSynthesis.getVoices() || [];
            ttsVoice = vs.find(v => /^en[-_]NG$/i.test(v.lang)) || vs.find(v => /^en[-_](GB|ZA|IN|KE)$/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
        }
        if (typeof speechSynthesis !== 'undefined') { pickVoice(); try { speechSynthesis.addEventListener('voiceschanged', pickVoice); } catch (e) {} }
        function hawkSpeak(h, idx, text, vol) {
            // Ambient hawker voices intentionally disabled; hawkers remain visible and interactive.
            return false;
            if (muted || !ambOn || !state.started || vol < 0.015) return false;
            if (typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') return false;
            try {
                if (speechSynthesis.speaking || speechSynthesis.pending) return false;
                if (fmOn && fmPlayer && fmPlayer.setVolume) { try { fmPlayer.setVolume(Math.round(radioVol * 100 * 0.42)); } catch (_) {} }
                const u = new SpeechSynthesisUtterance(text);
                if (ttsVoice) { u.voice = ttsVoice; u.lang = ttsVoice.lang; } else u.lang = 'en-NG';
                u.volume = clamp(Math.min(0.62, Math.max(0.32, vol)), 0, 1); u.rate = h.rate; u.pitch = h.pitch;
                // Keep the selected installed voice language; forcing unsupported locale codes can silence speech on mobile.
                try { speechSynthesis.resume(); } catch (_) {}
                u.onend = () => { if (fmOn && fmPlayer && fmPlayer.setVolume) { try { fmPlayer.setVolume(Math.round(radioVol * 100 * (state.dialogue ? 0.18 : 1))); } catch (_) {} } };
                speechSynthesis.speak(u);
                return true;
            } catch (e) { return false; }
        }

        const hawkers = [];
        for (let i = 0; i < 8; i++) {
            const kind = HAWK_KINDS[i % HAWK_KINDS.length];
            const g = randPerson(kind.prop, kind.goods);
            const sp = new THREE.Sprite(bubbleMat(kind.phrase)); sp.scale.set(4.6, 1.0, 1); sp.position.set(0, 3.1, 0); sp.renderOrder = 5;
            g.add(sp); g.userData.sprite = sp; scene.add(g);
            hawkers.push({ g: g, kind: kind, idx: i, x: 0, z: 0, hx: 0, hz: 0, state: 'idle', down: 0, ph: Math.random() * 6, off: Math.random() * 6,
                callT: rand(2, 5), called: false, pitch: [1.35, 1.2, 0.85, 1.0][i % 4] + rand(-0.08, 0.08), rate: rand(0.92, 1.06) });
        }
        function placeHawker(h, nearD, farD) {
            let x = 0, z = 0;
            for (let k = 0; k < 10; k++) {
                x = pick(HAWK_X); z = car.z - rand(nearD, farD);
                if (z < END_Z + 60) continue;
                if (Math.abs(x) > 12 && STOPS.some(s => Math.abs(s - z) < 26)) continue;
                break;
            }
            h.x = h.hx = x; h.z = h.hz = z; h.state = 'idle'; h.down = 0;
            setDown(h.g.userData, false);
            h.g.position.set(x, 0.03, z);
        }
        hawkers.forEach((h, i) => placeHawker(h, 55 + i * 45, 100 + i * 55));

        function updateHawkers(dt, active) {
            const sh = Math.sin(car.h), ch = Math.cos(car.h);
            for (let i = 0; i < hawkers.length; i++) {
                const h = hawkers[i], ud = h.g.userData;
                if (h.z > car.z + 90 || h.z < car.z - 520) placeHawker(h, 130, 420);
                const dxC = car.x - h.x, dzC = car.z - h.z, dist = Math.hypot(dxC, dzC);
                h.g.visible = dist < 320;
                if (!h.g.visible) continue;
                const lx = (h.x - car.x) * ch - (h.z - car.z) * sh;      // + = on my right
                const lz = -(h.x - car.x) * sh - (h.z - car.z) * ch;     // + = ahead of me

                if (h.down > 0) {
                    h.down -= dt;
                    if (h.down <= 0) { setDown(ud, false); h.state = 'return'; }
                    ud.sprite.visible = false;
                    continue;
                }
                const slow = car.speed < 7 && car.speed > -2;
                if (h.state === 'chase') { if (car.speed > 9.5 || dist > 40) h.state = 'return'; }
                else if (slow && active && dist < 30 && Math.abs(h.x - car.x) < 13 && h.z < car.z + 6) h.state = 'chase';

                let mx = 0, mz = 0, spd = 0, face = null;
                if (active && car.speed > 8 && lz > 0 && lz < 9 + car.speed * 0.55 && Math.abs(lx) < 2.7) {
                    const s = lx >= 0 ? 1 : -1;                          // jump out of the way
                    mx = s * ch; mz = -s * sh; spd = 5.5;
                } else if (h.state === 'chase') {
                    const side = h.x >= car.x ? 1 : -1;
                    const tx = car.x + side * 2.7, tz = car.z - 1.2;
                    const ddx = tx - h.x, ddz = tz - h.z, dd = Math.hypot(ddx, ddz);
                    if (dd > 0.5) { mx = ddx / dd; mz = ddz / dd; spd = Math.min(5, dd * 2.5 + Math.abs(car.speed) * 0.9); }
                    face = [car.x - h.x, car.z - h.z];
                } else if (h.state === 'return') {
                    const ddx = h.hx - h.x, ddz = h.hz - h.z, dd = Math.hypot(ddx, ddz);
                    if (dd > 0.6) { mx = ddx / dd; mz = ddz / dd; spd = 2.2; } else h.state = 'idle';
                }
                if (spd > 0) {
                    h.x += mx * spd * dt; h.z += mz * spd * dt;
                    h.ph += spd * dt * 2.6;
                    animWalk(ud, h.ph, clamp(0.3 + spd * 0.15, 0.3, 0.9));
                    h.g.rotation.y = face ? Math.atan2(face[0], face[1]) : Math.atan2(mx, mz);
                } else {
                    ud.legL.rotation.x = ud.legR.rotation.x = 0;
                    h.g.rotation.y = face ? Math.atan2(face[0], face[1]) : (Math.abs(h.x) < 1 ? Math.atan2(dxC, dzC) : (h.x > 0 ? -Math.PI / 2 : Math.PI / 2));
                    ud.body.rotation.z = Math.sin(time * 2 + h.off) * 0.03;
                    if (ud.waveArm) ud.waveArm.rotation.z = -(2.3 + Math.sin(time * 8 + h.off) * 0.3);
                }
                h.g.position.set(h.x, 0.03 + (spd > 0 ? Math.abs(Math.sin(h.ph * 2)) * 0.04 : 0), h.z);

                if (dist > 32) h.called = false;
                if (!h.called && active && dist < 24) {
                    const chasing = h.state === 'chase' && dist < 10;
                    const vol = Math.min(0.58, (0.34 + Math.pow(clamp(1 - dist / 24, 0, 1), 1.5) * 0.24)) * (state.dialogue ? 0.55 : 1);
                    if (hawkSpeak(h, h.idx, chasing ? 'Oga, buy am!' : h.kind.phrase, vol)) h.called = true;
                }
                const showBubble = dist < 72 && lz > -10;
                ud.sprite.visible = showBubble;
                if (showBubble) {
                    const near = h.state === 'chase' && dist < 12;
                    ud.sprite.material = bubbleMat(near ? 'Oga, buy am!' : h.kind.phrase);
                }

                if (active && peopleCD <= 0 && carRectHit(h.x, h.z, 0.45)) {
                    h.down = 2.5; setDown(ud, true, Math.random() < 0.5 ? 1 : -1);
                    h.x += -sh * 1.8; h.z += -ch * 2.2;
                    peopleImpact(35, 0.7, pick(['Oga! My goods! -35 pts', 'Hawker down! Mind the road! -35 pts']));
                }
            }
        }

        function updateRoadLife(dt, active) {
            if (peopleCD > 0) peopleCD -= dt;
            if (jamHornT > 0) jamHornT -= dt;
            updateCoins(dt, active);
            updateBarriers(active);
            updateCrossers(dt, active);
            updateHawkers(dt, active);
        }

        // ============================================================
        // 12b. STATE MISSIONS + PEOPLE KITS
        // ============================================================
        // Single core mission: ONBOARD NIGERIA (every state, same mission)
        const MC = { name: 'Onboard Nigeria', brief: 'Pick up 5 passengers and onboard each one into Web3 safely, the T3Kit way. Then reach the terminal.' };
        const MS = { noPower: false };
        const hexs = h => '#' + ('000000' + h.toString(16)).slice(-6);
        function roadLimit(z) { return ROAD_HALF + 1.5; }
        function inBridge(z) { return false; }
        function mHit(a) {}
        function sfxThump() { if (!actx) return; tone(90, 0.2, 'sine', 0.35, 0, 40); noiseHit(master, actx.currentTime, 'lowpass', 700, 0.15, 0.25); }
        const missionOf = () => ['Onboard ' + PASSENGERS.length + ' passengers to Web3', 'Reach ' + NGS.term + ' Terminal'];
        function updateMission(dt, active) { if (active) updateHud(); }
        function missionHud() {
            $('mission').innerHTML = '<div class="m-title">Onboard Nigeria</div><div class="m-row">👥 Onboarded ' + onboarded + '/' + PASSENGERS.length + '</div>';
        }
        function missionResult() {
            const ok = onboarded >= PASSENGERS.length;
            return { ok: ok, bonus: onboarded * 100 + (ok ? 300 : 0), notes: ['Onboarded ' + onboarded + '/' + PASSENGERS.length] };
        }

        // ---- people by culture ----
        function kitOpts(kitKey, gender) {
            const K = KITS[kitKey] || KITS.yo, f = gender === 'f', S = f ? K.f : K.m, o = { skin: pick(K.sk), scale: rand(0.93, 1.07) };
            if (f) {
                if (S.hijab) { o.hijab = pick(S.hijab); o.shirt = pick(S.top || S.hijab); o.skirt = o.shirt; }
                else {
                    o.shirt = pick(S.top); o.skirt = pick(S.wrap);
                    if (S.tie === 'gele' || S.tie === 'scarf') o.headtie = pick(S.tieC);
                    else if (S.tie === 'beanie') { o.capKind = 'beanie'; o.cap = pick(S.tieC); }
                }
            } else {
                if (S.robe) { o.robe = pick(S.robe); o.shirt = o.robe; o.pants = 0x222831; }
                else { o.shirt = pick(S.shirt); o.pants = pick(S.pants || [0x222831]); }
                if (S.cap && S.cap !== 'none') { o.capKind = S.cap; o.cap = pick(S.capC || [0xffffff]); }
            }
            if (S.beads) o.beads = S.beads;
            return o;
        }
        function makePassengerKit(kitKey, g) {
            const o = kitOpts(kitKey, g); o.scale = 1.12;
            const p = makePerson(o); if (p.userData.armR) p.userData.arm = p.userData.armR; return p;
        }
        function initPassengerMeshes() {
            $('start-sub').textContent = 'Drive your danfo from ' + NGS.city + ' to ' + NGS.term + '. Pick up 5 passengers and help each one understand Web3 safely, the T3Kit way.';
            $('start-mission').innerHTML = '<b style="color:#00e5ff">MISSION: ' + (MC.name || '') + '</b><br>' + (MC.brief || '') + '<br><small style="color:#8fdcec">' + missionOf().join(' · ') + '</small>';
            PASSENGERS.forEach(p => {
                p.mesh = makePassengerKit(V.kit, p.g || 'm');
                p.mesh.position.set(21, SH_Y, p.z); p.mesh.rotation.y = -Math.PI / 2; p.leaving = false;
                scene.add(p.mesh);
            });
        }

        // ============================================================
        // 13. MAIN LOOP
        // ============================================================
        const clock = new THREE.Clock();
        let time = 0, pitch = 0, roll = 0, hudAcc = 0, radarAcc = 0, qLevel = 0, fpsAcc = 0, fpsN = 0;
        function applyQuality(l) {
            if (l === 1) pixelRatio = Math.min(pixelRatio, 1.5);
            if (l === 2) sun.castShadow = false;
            if (l === 3) pixelRatio = Math.max(pixelRatio, 1.25);
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(innerWidth, innerHeight);
        }

        function loop() {
            if (dead) return;
            requestAnimationFrame(loop);
            const raw = clock.getDelta();
            const dt = Math.min(raw, 0.05);
            time += dt;
            if (state.started && time > 4) {
                fpsAcc += raw; fpsN++;
                if (fpsAcc >= 2) {
                    if (fpsAcc / fpsN > 1 / 36 && qLevel < 3) applyQuality(++qLevel);
                    fpsAcc = 0; fpsN = 0;
                }
            }
            hudAcc += dt; radarAcc += dt;

            const active = state.started && !state.ended && !state.dialogue;
            readInput(dt);
            if (active) { elapsed += dt; updateCar(dt); }
            else if (state.ended) {
                car.speed *= Math.pow(0.1, dt);
                car.x += -Math.sin(car.h) * car.speed * dt; car.z += -Math.cos(car.h) * car.speed * dt;
            }
            if (!state.dialogue) updateTraffic(dt);
            if (active) checkCollisions(dt);
            if (!state.dialogue) updateRoadLife(dt, active);

            if (hornOn && active) {
                traffic.forEach(t => {
                    if (t.same && Math.abs(t.x - car.x) < 6 && t.z < car.z && car.z - t.z < 45) t.boost = Math.min(5, t.boost + dt * 8);
                });
            }

            const accel = dt > 0 ? (car.speed - car.prevSpeed) / dt : 0;
            pitch += (clamp(accel * 0.0025, -0.05, 0.04) - pitch) * Math.min(1, dt * 6);
            roll += (clamp(-car.yawRate * car.speed * 0.0035, -0.06, 0.06) - roll) * Math.min(1, dt * 6);
            danfo.position.set(car.x, hopY, car.z);
            danfo.rotation.y = car.h;
            rig.rotation.x = pitch; rig.rotation.z = roll;
            wheels.forEach(w => {
                w.roll.rotation.x -= car.speed * dt / 0.5;
                if (w.front) w.sg.rotation.y = -car.steer * 1.4;
            });
            steerSpin.rotation.z = -car.steer * 5;
            tailMat.emissiveIntensity = (braking || (handbrake && car.speed > 0.4)) ? 3 : 0.5;

            PASSENGERS.forEach((p, i) => {
                if (!p.mesh.visible) return;
                const arm = p.mesh.userData.arm;
                if (p.leaving) {
                    p.mesh.position.x += (car.x - p.mesh.position.x) * Math.min(1, dt * 5);
                    p.mesh.position.z += (car.z - p.mesh.position.z) * Math.min(1, dt * 5);
                    p.mesh.scale.multiplyScalar(Math.pow(0.02, dt));
                    if (p.mesh.scale.x < 0.06) p.mesh.visible = false;
                } else if (i === curIdx) {
                    arm.rotation.z = Math.PI * 0.85 + Math.sin(time * 9) * 0.35;
                    p.mesh.position.y = SH_Y + Math.abs(Math.sin(time * 4)) * 0.08;
                } else arm.rotation.z = 0.05;
            });

            gem.rotation.y = time * 2; gem.position.y = 6.5 + Math.sin(time * 3) * 0.4;
            ring.scale.setScalar(1 + Math.sin(time * 3) * 0.03);

            const gx = Math.round(car.x / 3) * 3, gz = Math.round(car.z / 3) * 3;
            sun.position.set(gx + SK.sd[0], SK.sd[1], gz + SK.sd[2]);
            sun.target.position.set(gx, 0, gz);

            updateCamera(dt);
            skyDome.position.copy(camera.position); sunDisc.position.copy(camera.position).addScaledVector(sunDir, 820); sunDisc.lookAt(camera.position);
            updateWeather(dt); flames.forEach(f => { f.scale.y = 1 + Math.sin(time * 9 + f.position.x) * 0.15; });
            updateMission(dt, active);
            updateNav(dt);

            $('steer-dot').style.transform = 'translateX(' + (car.steerIn * 66) + 'px)';

            if (hornOn) { hornHeld += dt; if (hornHeld > 2.5) { hornOn = false; touch.horn = false; kbHorn = false; } } else hornHeld = 0;
            if (actx) { if (hornOn && !state.dialogue) hornStart(); else hornStop(); }
            if (active) vibe = clamp(vibe + ((radioPlaying || streak > 0) ? 2 : -0.4) * dt, 0, 100);
            farHornT -= dt;
            if (farHornT <= 0) { farHornT = rand(22, 45); if (active) sfxFarHorn(); }
            updateAmbience(Math.abs(car.speed), throttleIn);
            updateEngine(dt);
            updateStreet(dt);

            if (radarAcc > 0.05) { radarAcc = 0; drawRadar(); }
            renderer.render(scene, camera);
        }

        addEventListener('resize', () => {
            camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
            renderer.setSize(innerWidth, innerHeight);
        });
        document.addEventListener('visibilitychange', () => { if (document.hidden) releaseTouch(); });

        initPassengerMeshes();
        setTarget();
        updateHud();
        loop();
    return teardown;
}
