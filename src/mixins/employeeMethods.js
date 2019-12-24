export default {
  methods: {
    convertEmployeeType(type) {
      let employeeTitle
      switch (type) {
        case 1: {
          employeeTitle = 'Admin'
          break
        }
        case 2: {
          employeeTitle = 'Regular Staff'

          break
        }
        case 3: {
          employeeTitle = 'Locumn'

          break
        }
        default:
          break
      }
      return employeeTitle
    },
    convertShift(type) {
      let shiftTitle, shiftClass
      switch (type) {
        case 1: {
          shiftClass = 'normal_staff'
          shiftTitle = 'Regular shift'
          break
        }
        case 2: {
          shiftClass = 'locumn'
          shiftTitle = 'Locumn shift'

          break
        }
        case 3: {
          shiftClass = 'holiday'
          shiftTitle = 'Holiday'

          break
        }
        case 4: {
          shiftClass = 'time_off'
          shiftTitle = 'Time off'

          break
        }
        case 5: {
          shiftClass = 'sick_leave'
          shiftTitle = 'Sick leave'

          break
        }
        default:
          break
      }
      return { title: shiftTitle, class: shiftClass }
    }
  }
}
