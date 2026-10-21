/* elev8 — shared BMI / body-composition logic and a tiny DOM binder.
   Each page marks up its live values with data-* attributes:
     data-text="key"           → textContent = value
     data-vars="name=key ..."  → style.setProperty('--name', value)
     data-attr="attr=key ..."  → setAttribute(attr, value)
     data-input="key"          → range input bound to state[key]
     data-unit="metric|imperial" → unit radio
     data-sport="key"          → training-type button
*/
(function () {
  'use strict';

  var SPORTS = {
    strength: { name: 'Strength', range: [22, 26] },
    endurance: { name: 'Endurance', range: [18, 21] },
    team: { name: 'Team sport', range: [20, 23] },
    physique: { name: 'Physique', range: [23, 27] }
  };

  var RING = { bmi: 1256.6, ffmi: 992.7, bf: 728.8 }; // 2πr for r = 200, 158, 116

  function pos(v, a, b) {
    return Math.max(0, Math.min(100, (v - a) / (b - a) * 100));
  }

  function compute(state) {
    var h = state.heightCm / 100;
    var bmiN = state.weightKg / (h * h);
    var lean = state.weightKg * (1 - state.bf / 100);
    var fat = state.weightKg - lean;
    var ffmiN = lean / (h * h) + 6.1 * (1.8 - h);
    var imp = state.unit === 'imperial';
    var inches = Math.round(state.heightCm / 2.54);
    var mass = function (v) {
      return imp ? Math.round(v * 2.2046) + ' lb' : v.toFixed(1).replace(/\.0$/, '') + ' kg';
    };

    var bmiCat = bmiN < 18.5 ? 'Underweight' : bmiN < 25 ? 'Healthy range' : bmiN < 30 ? 'Overweight' : 'Obese range';
    var ffmiCat = ffmiN < 18 ? 'Below average' : ffmiN < 20 ? 'Average' : ffmiN < 22 ? 'Above average'
      : ffmiN < 23 ? 'Excellent' : ffmiN < 26 ? 'Superior' : 'Elite';
    var catPhrase = {
      'Underweight': 'underweight range', 'Healthy range': 'healthy range',
      'Overweight': 'overweight range', 'Obese range': 'obese range'
    }[bmiCat];
    var muscular = bmiN >= 25 && ffmiN >= 21 && state.bf <= 18;
    var verdict = muscular
      ? 'BMI puts you in the ' + catPhrase + '. At ' + state.bf + '% body fat, that weight is mostly muscle — your FFMI of ' + ffmiN.toFixed(1) + ' is the better measure.'
      : 'A BMI of ' + bmiN.toFixed(1) + ' sits in the ' + catPhrase + '. Add your body fat to see how much of it is lean mass.';

    var sport = SPORTS[state.sport];
    var sMin = sport.range[0], sMax = sport.range[1];

    return {
      bf: state.bf,
      bfLabel: state.bf + '%',
      heightLabel: imp ? Math.floor(inches / 12) + '′ ' + (inches % 12) + '″' : state.heightCm + ' cm',
      weightLabel: mass(state.weightKg),
      leanLabel: mass(lean),
      fatLabel: mass(fat),
      bmi: bmiN.toFixed(1),
      bmiCat: bmiCat,
      ffmi: ffmiN.toFixed(1),
      ffmiCat: ffmiCat,
      verdict: verdict,
      bmiPos: pos(bmiN, 15, 40),
      ffmiPos: pos(ffmiN, 16, 28),
      rangeL: pos(sMin, 16, 28),
      rangeW: pos(sMax, 16, 28) - pos(sMin, 16, 28),
      sportName: sport.name.toLowerCase(),
      sportRange: sMin + '–' + sMax,
      ringBmi: RING.bmi * (1 - pos(bmiN, 15, 40) / 100),
      ringFfmi: RING.ffmi * (1 - pos(ffmiN, 14, 28) / 100),
      ringBf: RING.bf * (1 - pos(state.bf, 0, 40) / 100)
    };
  }

  function pairs(spec) {
    return spec.trim().split(/\s+/).map(function (p) { return p.split('='); });
  }

  function mount(root, initial) {
    root = root || document;
    var state = Object.assign({ unit: 'metric', heightCm: 183, weightKg: 92, bf: 12, sport: 'strength' }, initial);
    var $$ = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };

    function render() {
      var v = compute(state);
      $$('[data-text]').forEach(function (el) { el.textContent = v[el.dataset.text]; });
      $$('[data-vars]').forEach(function (el) {
        pairs(el.dataset.vars).forEach(function (p) { el.style.setProperty('--' + p[0], v[p[1]]); });
      });
      $$('[data-attr]').forEach(function (el) {
        pairs(el.dataset.attr).forEach(function (p) { el.setAttribute(p[0], v[p[1]]); });
      });
      $$('[data-input]').forEach(function (el) {
        el.value = state[el.dataset.input];
        el.setAttribute('aria-valuetext', v[{ heightCm: 'heightLabel', weightKg: 'weightLabel', bf: 'bfLabel' }[el.dataset.input]]);
      });
      $$('[data-unit]').forEach(function (el) { el.checked = el.dataset.unit === state.unit; });
      $$('[data-sport]').forEach(function (el) {
        var on = el.dataset.sport === state.sport;
        el.classList.toggle('btn-primary', on);
        el.classList.toggle('btn-secondary', !on);
        el.setAttribute('aria-pressed', String(on));
      });
    }

    function set(patch) {
      Object.assign(state, patch);
      render();
    }

    $$('[data-input]').forEach(function (el) {
      el.addEventListener('input', function () {
        var patch = {};
        patch[el.dataset.input] = +el.value;
        set(patch);
      });
    });
    $$('[data-unit]').forEach(function (el) {
      el.addEventListener('change', function () { if (el.checked) set({ unit: el.dataset.unit }); });
    });
    $$('[data-sport]').forEach(function (el) {
      el.addEventListener('click', function () { set({ sport: el.dataset.sport }); });
    });

    render();
    return { set: set, get state() { return Object.assign({}, state); } };
  }

  window.Elev8 = { compute: compute, mount: mount, SPORTS: SPORTS };
})();
