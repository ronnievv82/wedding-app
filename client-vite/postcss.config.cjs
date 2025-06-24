import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

module.exports = {
  plugins: [require('@tailwindcss/postcss')(), require('autoprefixer')],
};
