/* global Vue */
/* global axios */
/* global location */

var app = new Vue({
    el: '#app',
    data: {
        message: '',
        error: false,
        displayTab: {
            daily: true,
            common: false,
            hist: false,
        },
        showAddForm: false,
        facts: {},
        daily: {},
        hist: {},
        totals: {
            calories: 0,
            fat: 0,
            chol: 0,
            sodium: 0,
            carbs: 0,
            fiber: 0,
            sugars: 0,
            proteins: 0
        },
        goals: {
            calories: 2000,
            fat: 60,
            chol: 200,
            sodium: 2000,
            carbs: 150,
            fiber: 30,
            sugars: 26,
            proteins: 56
        },
        date: '',
        food: {
            name: '',
            units: '',
            servingSize: 0,
            calories: 0,
            fat: 0,         // grams
            chol: 0,               // miligrams
            sodium: 0,             // miligrams
            carbs: 0,       // grams
            fiber: 0,       // grams
            sugars: 0,      // grams
            proteins: 0,    // grams
        },
        multiplier: 0,
        info: 'not found',
    },
    methods: {
        toggleAddForm() { this.showAddForm = !this.showAddForm; },
        closeForm() { 
            console.log('called closeForm');
            this.showAddForm = false; 
            this.clearForm();
        },
        clearForm() {
            this.food.name = '';
            this.food.units = '',
            this.food.servingSize = 0;
            this.food.calories = 0;
            this.food.fat = 0;    
            this.food.chol = 0;
            this.food.sodium = 0;  
            this.food.carbs = 0;       
            this.food.fiber = 0;       
            this.food.sugars = 0;      
            this.food.proteins = 0;    
            this.info = 'not found';
            this.multiplier = 0;
        },
        display(tab) {
            console.log('display(' + tab + ')');
            this.displayTab.common = false;
            this.displayTab.daily = false;
            this.displayTab.hist = false;
            if (tab == 0) { this.displayTab.daily = true; location.reload(); }
            if (tab == 1) { this.displayTab.common = true; }
            if (tab == 2) { this.displayTab.hist = true; }
        },
        setError() {
            this.message = ''
            this.error = false;
        },
        async getFacts() {
            console.log('called getFacts()');
            try {
                const res = await axios.get('/getFacts');
                console.log('facts:', res.data);
                this.facts = res.data;
            } catch (e) { console.log(e); }
        },
        async getDailyFood() {
            console.log('called getDailyFood()');
            try {
                const res = await axios.get('/getDailyFood');
                console.log('daily food:', res.data);
                this.daily = res.data;
                this.getTotals();
                if (res.data.length > 0) {
                    if (res.data[0].date != this.date) { 
                        /* MOVE TO HISTORY TAB */
                        this.addHistory();
                        this.resetTotals();
                        this.clearDaily();
                    }
                }
                this.getHistory();
            } catch(e) { console.log(e) }
        },
        async getHistory() {
            console.log('called getHistory');
            try {
                const res = await axios.get('/getHistory');
                console.log('hist: ', res.data);
                this.hist = res.data;
            } catch(e) { console.log(e); }
        },
        getTotals() {
            this.resetTotals();
            for (let i = 0; i < this.daily.length; i++) {
                this.totals.calories += this.daily[i].calories;
                this.totals.fat += this.daily[i].fat;
                this.totals.chol += this.daily[i].chol;
                this.totals.sodium += this.daily[i].sodium;
                this.totals.carbs += this.daily[i].carbs;
                this.totals.fiber += this.daily[i].fiber;
                this.totals.sugars += this.daily[i].sugars;
                this.totals.proteins += this.daily[i].proteins;
            }
            this.calcBars();
            console.log('totals: ', this.totals);
        },
        clear() {
            if (this.displayTab.daily) { this.clearDaily(); }
            else if (this.displayTab.common) {}
            else if (this.displayTab.hist) {}
        },
        async clearDaily() {
            console.log('called clearDaily');
            try {
                for (let i = 0; i < this.daily.length; i++) { const res = await axios.delete('/removeDaily/' + this.daily[i].name); }
            } 
            catch(e) { console.log(e); }
            this.getDailyFood();
        },
        async calcBars() {
            console.log('calcBars');
            // CALORIES BAR
            var bar = 0 + (this.totals.calories / this.goals.calories) * 100;
            var ele = document.getElementById("calories").style;
            ele.width = bar + '%';
            if (bar == 0) { ele.background = 'transparent'; }
            else {
                if (bar >= 100) { ele.background = 'brown'; }
                else if (bar > 60) { ele.background = 'burlywood'; }
                else { ele.background = 'cornflowerblue'; }
            }
            
            
            // FAT BAR
            bar = 0 + (this.totals.fat / this.goals.fat) * 100;
            ele = document.getElementById("fat").style;
            ele.width = bar + '%';
            if (bar == 0) { ele.background = 'transparent'; }
            else {
                if (bar > 100) { ele.background = 'brown'; }
                else if (bar > 60) { ele.background = 'burlywood'; }
                else { ele.background = 'cornflowerblue'; }
            }
            
            // CHOL BAR
            bar = 0 + (this.totals.chol / this.goals.chol) * 100;
            ele = document.getElementById("chol").style;
            ele.width = bar + '%';
            if (bar == 0) { ele.background = 'transparent'; }
            else {
                if (bar >= 100) { ele.background = 'brown'; }
                else if (bar > 60) { ele.background = 'burlywood'; }
                else { ele.background = 'cornflowerblue'; }
            }
            
            // SODIUM BAR
            bar = 0 + (this.totals.sodium / this.goals.sodium) * 100;
            ele = document.getElementById("sodium").style;
            ele.width = bar + '%';
            if (bar == 0) { ele.background = 'transparent'; }
            else {
                if (bar >= 100) { ele.background = 'brown'; }
                else if (bar > 60) { ele.background = 'burlywood'; }
                else { ele.background = 'cornflowerblue'; }
            }
            
            // CARBS BAR
            bar = 0 + (this.totals.carbs / this.goals.carbs) * 100;
            ele = document.getElementById("carbs").style;
            ele.width = bar + '%';
            if (bar == 0) { ele.background = 'transparent'; }
            else {
                if (bar >= 100) { ele.background = 'brown'; }
                else if (bar > 60) { ele.background = 'burlywood'; }
                else { ele.background = 'cornflowerblue'; }
            }
            
            // FIBER BAR
            bar = 0 + (this.totals.fiber / this.goals.fiber) * 100;
            ele = document.getElementById("fiber").style;
            ele.width = bar + '%';
            if (bar == 0) { ele.background = 'transparent'; }
            else {
                if (bar >= 100) { ele.background = 'brown'; }
                else if (bar > 60) { ele.background = 'burlywood'; }
                else { ele.background = 'cornflowerblue'; }
            }
            
            // SUGARS BAR
            bar = 0 + (this.totals.sugars / this.goals.sugars) * 100;
            ele = document.getElementById("sugars").style;
            ele.width = bar + '%';
            if (bar == 0) { ele.background = 'transparent'; }
            else {
                if (bar >= 100) { ele.background = 'brown'; }
                else if (bar > 60) { ele.background = 'burlywood'; }
                else { ele.background = 'cornflowerblue'; }
            }
            
            // PROTEINS BAR
            bar = 0 + (this.totals.proteins / this.goals.proteins) * 100;
            ele = document.getElementById("proteins").style;
            ele.width = bar + '%';
            if (bar == 0) { ele.background = 'transparent'; }
            else {
                if (bar >= 100) { ele.background = 'brown'; }
                else if (bar > 60) { ele.background = 'burlywood'; }
                else { ele.background = 'cornflowerblue'; }
            }
        },
        async add() {
            console.log('called add()');
            try {
                if (this.displayTab.common) {
                    console.log('adding to database');
                    let response = await axios.post('/addFact', {
                        name: this.food.name,
                        units: this.food.units,
                        servingSize: this.food.servingSize,
                        calories: this.food.calories,
                        fat: this.food.fat,
                        chol: this.food.chol,
                        sodium: this.food.sodium,
                        carbs: this.food.carbs,
                        fiber: this.food.fiber,
                        sugars: this.food.sugars,
                        proteins: this.food.proteins
                    });
                    console.log(response);
                    this.getFacts();
                } else if ( this.displayTab.daily) {
                    console.log('add to daily');
                    if (this.info == 'not found') {
                        this.message = 'unable to find food in database';
                        this.error = true;
                        throw 'not found';
                    }
                    var d = new Date();
                    let res = await axios.post('/addDaily', {
                        name: this.food.name,
                        servings: this.multiplier,
                        date: d.toDateString(),
                    });
                    await this.getDailyFood();
                    this.getTotals();
                    this.info = 'not found';
                } else if (this.displayTab.hist) {
                    this.error = true;
                    this.message = 'updates automatically';
                }
                if (!this.error) { this.closeForm(); }
            } catch(e) { console.log(e) }
            this.clearForm();
        },
        async addHistory() {
            try {
                const res = await axios.post('/addHistory', {
                    date: this.daily[0].date,
                    calories: this.totals.calories,
                    fat: this.totals.fat,
                    chol: this.totals.chol,
                    sodium: this.totals.sodium,
                    carbs: this.totals.carbs,
                    fiber: this.totals.fiber,
                    sugars: this.totals.sugars,
                    proteins: this.totals.proteins
                });
            } catch(e) { console.log(e); }
        },
        async remove(_name) {
            console.log('called remove()');
            try {
                if (this.displayTab.common) {
                    console.log('removing from database');
                    await axios.delete('/removeFact/' + _name);
                    this.getFacts();
                } else if ( this.displayTab.daily) {
                    console.log('remove from daily');
                    await axios.delete('removeDaily/' + _name);
                    await this.getDailyFood();
                    this.getTotals();
                }  else if ( this.displayTab.hist) {
                    console.log('remove from hist');
                    await axios.delete('removeHist' + _name);
                    await this.getHistory();
                }
                this.closeForm();
            } catch(e) { console.log(e) }
        },
        calcInfo() {
            console.log('calcInfo');
            var holder = 'not found';
            return this.facts.forEach((item) => {
                if (item.name == this.food.name) {
                    var i = item.servingSize + ' ' + item.units;
                    console.log('info: ', i);
                    this.info = i;
                    holder = i;
                    return;
                } else {
                    if (holder == "not found") { this.info = 'not found'; }
                    else { this.info = holder; }
                }
            });
        },
        resetTotals() {
            this.totals.calories = 0;
            this.totals.fat = 0;
            this.totals.chol = 0;
            this.totals.sodium = 0;
            this.totals.carbs = 0;
            this.totals.fiber = 0;
            this.totals.sugars = 0;
            this.totals.proteins = 0;
            
        },
    },
    computed: {
        sortedFacts() {
            return this.facts.sort((a, b) => {
                var rval = 0;
                if (a.name < b.name) {
                    rval = -1;
                } else {
                    rval = 1;
                }
                return rval;
            });
        },
        reverseHist() {
            for (let i = this.hist.length - 1; i >= 0; i--) { return this.hist[i]; }
        }
    },
    async created() {
        var d = new Date();
        this.date = d.toDateString();
        this.getFacts();
        this.getDailyFood();
    },
});