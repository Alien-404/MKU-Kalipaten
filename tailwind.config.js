module.exports = {
  content: [
    './views/**/*.{html,ejs}',
    './views/**/**/*.{html,ejs}',
    './public/**/*.{css, js}'
  ],
  theme: {
    extend: {
      fontFamily: {
        modern: ['Modern Sans']
      },
      colors: {
        prime: '#3740CA',
        secondary: '#EFFFFD'
      }
    },
  },
  plugins: [
    require('kutty')
  ],
}
