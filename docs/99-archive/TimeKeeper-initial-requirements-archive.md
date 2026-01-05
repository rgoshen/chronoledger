# TimeKeeper App

Created: January 2, 2026 12:21 PM
Last edited time: January 2, 2026 1:12 PM
Tags: Personal, Planning, Work

## Purpose

TimeKeeper is a solution to help me track my current hours worked per day per code.  Track my Accrued Time Off (ATO) and my projected use/lose ATO.  It will produce a pay period summary, current month summary, and a current year summary.  It will also keep current year and historical work records.

## Platforms

- Web
- Mobile (phone and tablet)
- Host on AWS

## Requirements

- Rule: Two pay periods in a month
  - PP1: from 1st to 15th of the month
  - PP2: from 16th to eom
- Rule: can not carry over more than 120 hours per year
- Rule: Accumulate 10 hrs per pay period
  - Only calculate ATO for past pay periods and not the current pay period
- Rule: Cannot take anymore than 40 hours against contract codes per week
- Rule: Cannot take more than 4 additional hours above 40 contract hours per week
  - i.e. combination of training, other, recruiting, connexion, flexcelerate up to 4 additional hours
- Rule: If more than 44 total hours per week, should ensure have prior authorization
- Rule: no overtime for pay purposes
- Rule: ATO pay is based on hourly rate at which it was accrued
- Should be able to sync across platforms

### Time entry

1. Enter date in MM/DD/YYYY format (always required)
2. Enter start time in HH:MM format
3. Enter end time in HH:MM format
4. Select 24-hr or 12-hr
    1. if 12-hr then need to select AM or PM (required if 12-hr)
5. Enter in Time Code (ATO, HSES, MCADS, CONNEXION, FLEXCELERATE, OTHER, USTC, RECRUITING, UPDLV, TRAINING) (always required)
6. Once start and stop times entered, calculate total hours to nearest 15 mins otherwise show 0
7. Enter in partial time
    1. enter in start time without end time
    2. if entering in end time, search on date, time code and in start time but no end time entered and if does not exist, alert user cannot enter in end time with a start time.
8. Validation:
    1. stop time can not occur before end time on same date
    2. check if 12-hr time, then must enter in AM or PM
9. Entry only for current pay period
    1. date should be in range of the current pay period
10. Entry form should should show title
11. Entry form should show current pay period

### Pay Period Summary

1. Show title
2. Show pay period
3. Show all days within that pay period
    1. highlight weekend days
    2. holidays should also be obvious
4. Show each entry day of week, date, all codes of time taken for each date and daily totals (actual and rounded to nearest 15 mins)
5. Show/calculate total week days in pay period, total contract hours + additional hours available in pay period
6. Show/calculate total hours accounted and remaining hours
7. Show/calculate breakdown of hours against each code and pay based on hourly rate
8. Show/calculate total gross compensation for pay period
9. Show/calculate ATO YTD accrued
10. Show/calculate ATO used to date
11. Show/calculate ATO left
12. Show/calculate Projected ATO left to accumulate
13. Show/calculate ATO use/lose (projected)

### Reports

1. Time entry reports
    1. selected by:
        1. pay period
        2. month
        3. year
    2. if selected by month or year, there should be visible differentiation of pay periods
2. Pay period summary reports per inputted pay period
    1. selected by:
        1. pay period
        2. month
        3. year
    2. if selected by month or year, there should be visible differentiation of pay periods
3. Historical reports
    1. selected by:
        1. pay period
        2. month
        3. year
4. ATO tracking
