import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';
import fs from 'fs';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';

const production = !process.env.ROLLUP_WATCH;

const railTarget = "1A1";

const mediaFiles = fs.readdirSync("./public/" + railTarget + "media/");

// const railMediaDirectoresToDelete = fs.readdirSync("../Rail " + railTarget).filter(dir => dir.includes('media')).filter(dir => dir.includes(railTarget) ? false : true);
// console.log(railMediaDirectoresToDelete);

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js',
		intro: `const MEDIA_FILES = ${JSON.stringify(mediaFiles)};`
	},
	plugins: [
		replace({
			RAIL_TARGET: railTarget,
			delimiters: ['', '']
		}),
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		json(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
		copy({
			targets: [{src: './public/', dest: '../' + railTarget}]
		}),
		del({
			targets: ['../' + railTarget + '/public/*media', '!../' + railTarget + '/public/'+ railTarget + 'media'],
			hook: 'writeBundle',
			force: true
		})
	],
	watch: {
		clearScreen: false
	}
};
