import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

// Motion Canvas dev server + editor, with the local ffmpeg exporter for mp4/webm.
export default defineConfig({
  plugins: [motionCanvas(), ffmpeg()],
});
