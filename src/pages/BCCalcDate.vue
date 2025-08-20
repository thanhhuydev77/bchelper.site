<template>
  <div class="pa-2">
    <v-container class="ma-0">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="originDate"
            type="date"
            label="Origin Date"
            @input="calculateResult"
            required
            solo
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="dateFormula"
            label="Date Formula"
            placeholder="+1D, -2M, +1Y"
            @input="onFormulaInput"
            required
            solo
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field 
            variant="solo-inverted"
            label="Result Date"
            v-model="resultDate"
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <div v-if="error" style="color: red; margin-top: 8px;">
        <v-alert type="error" dense>{{ error }}</v-alert>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "BCCalcDate",
  data() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return {
      originDate: `${yyyy}-${mm}-${dd}`,
      dateFormula: "",
      resultDate: "",
      error: ""
    };
  },
  mounted() {
    this.calculateResult();
  },
  watch: {
    originDate() {
      this.calculateResult();
    },
    dateFormula() {
      this.calculateResult();
    }
  },
  methods: {
    formatWithOriginLocale(date) {
      try {
        const formatter = new Intl.DateTimeFormat(navigator.language, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        return formatter.format(date);
      } catch (e) {
        return date.toISOString().slice(0, 10);
      }
    },
    onFormulaInput(e) {
      this.dateFormula = e.target.value.toUpperCase();
      this.calculateResult();
    },
    calculateResult() {
      this.error = "";
      if (!this.originDate || !this.dateFormula) {
        this.resultDate = "";
        return;
      }
      try {
        this.resultDate = this.calcDate(this.dateFormula, this.originDate);
      } catch (e) {
        this.resultDate = "";
        this.error = e.message;
      }
    },
    // Simple parser for formulas like +1D, -2M, +1Y
    calcDate(formula, dateStr) {
      formula = formula.toUpperCase();
      // Handle ranges (..)
      if (formula.includes('..')) {
        const [startExpr, endExpr] = formula.split('..');
        const start = this.calcDate(startExpr, dateStr);
        const end = this.calcDate(endExpr, dateStr);
        return `${start} .. ${end}`;
      }
      // Parse origin as local date to avoid timezone shifts
      const [yStr, mStr, dStr] = (dateStr || '').split('-');
      const y = Number(yStr);
      const m = Number(mStr);
      const d = Number(dStr);
      let date = isFinite(y) && isFinite(m) && isFinite(d)
        ? new Date(y, m - 1, d)
        : new Date(dateStr);
      // Handle -CM/+CM/CM (first/last day of current month), -CQ/+CQ/CQ (first/last day of current quarter), -CY/+CY/CY (first/last day of current year)
      let specialMatch = formula.match(/^([+-]?)(CM|CQ|CY)/i);
      if (specialMatch) {
        let sign = specialMatch[1];
        const code = specialMatch[2].toUpperCase();
        if (!sign) sign = '+'; // treat no sign as +
        if (code === 'CM') {
          if (sign === '-') {
            date.setDate(1);
          } else {
            date.setMonth(date.getMonth() + 1, 0);
          }
        } else if (code === 'CQ') {
          const month = date.getMonth();
          const quarterStartMonth = Math.floor(month / 3) * 3;
          if (sign === '-') {
            date.setMonth(quarterStartMonth, 1);
          } else {
            date.setMonth(quarterStartMonth + 3, 0);
          }
        } else if (code === 'CY') {
          if (sign === '-') {
            date.setMonth(0, 1);
          } else {
            date.setMonth(12, 0);
          }
        }
        formula = formula.replace(/^([+-]?)(CM|CQ|CY)/i, '');
      }
      // WDn logic
      let wdMatch = formula.match(/^([+-]?)WD(\d)/i);
      if (wdMatch) {
        const sign = wdMatch[1];
        const n = parseInt(wdMatch[2], 10); // 1=Monday, 7=Sunday
        const day = date.getDay() === 0 ? 7 : date.getDay();
        if (sign === '-') {
          let daysBack = (day - n + 7) % 7;
          if (daysBack === 0) daysBack = 7;
          date.setDate(date.getDate() - daysBack);
        } else {
          let daysForward = (n - day + 7) % 7;
          if (daysForward === 0 && sign === '+') daysForward = 7;
          date.setDate(date.getDate() + daysForward);
        }
        formula = formula.replace(/^([+-]?)WD\d/i, '');
      }
      // Dn = next day of month (e.g. D1 = next 1st of month)
      let dnMatch = formula.match(/^D(\d{1,2})/i);
      if (dnMatch) {
        const n = parseInt(dnMatch[1], 10);
        let next = new Date(date);
        next.setDate(n);
        if (next <= date) {
          next.setMonth(next.getMonth() + 1);
        }
        date = next;
        formula = formula.replace(/^D\d{1,2}/i, '');
      }
      // Wn = next week number (e.g. W1 = next week 1 of year)
      let wnMatch = formula.match(/^W(\d{1,2})/i);
      if (wnMatch) {
        const n = parseInt(wnMatch[1], 10);
        let next = new Date(date);
        // Find the first Monday of the year
        let year = next.getFullYear();
        let firstMonday = new Date(year, 0, 1);
        while (firstMonday.getDay() !== 1) firstMonday.setDate(firstMonday.getDate() + 1);
        // Calculate the Monday of week n
        let weekMonday = new Date(firstMonday);
        weekMonday.setDate(firstMonday.getDate() + (n - 1) * 7);
        if (weekMonday <= date) {
          // If already past, go to next year
          year++;
          firstMonday = new Date(year, 0, 1);
          while (firstMonday.getDay() !== 1) firstMonday.setDate(firstMonday.getDate() + 1);
          weekMonday = new Date(firstMonday);
          weekMonday.setDate(firstMonday.getDate() + (n - 1) * 7);
        }
        date = weekMonday;
        formula = formula.replace(/^W\d{1,2}/i, '');
      }
      // Chained expressions: +nD, -nW, +nM, -nY, +nQ
      const regex = /([+-])(\d+)([DMYQW])/g;
      let match;
      let found = false;
      while ((match = regex.exec(formula)) !== null) {
        found = true;
        const sign = match[1] === "+" ? 1 : -1;
        const value = parseInt(match[2], 10) * sign;
        const unit = match[3];
        if (unit === "D") {
          date.setDate(date.getDate() + value);
        } else if (unit === "W") {
          date.setDate(date.getDate() + value * 7);
        } else if (unit === "M") {
          date.setMonth(date.getMonth() + value);
        } else if (unit === "Y") {
          date.setFullYear(date.getFullYear() + value);
        } else if (unit === "Q") {
          date.setMonth(date.getMonth() + value * 3);
        } else {
          throw new Error("Invalid unit in formula. Use D, W, M, Y, or Q.");
        }
      }
      if (!found && formula.trim() !== "") throw new Error("Invalid formula format.");
      return this.formatWithOriginLocale(date);
    }
  }
};
</script>

<style scoped>
</style> 