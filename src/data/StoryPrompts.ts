import { StoryPrompt } from '../model/Artwork';

import config from '../config/config';

const { storyPrompts } = config.dialog;

const StoryPrompts: StoryPrompt[] = [
  { id: 1, prompt: storyPrompts[1] },
  { id: 2, prompt: storyPrompts[2] },
  { id: 3, prompt: storyPrompts[3] },
  { id: 4, prompt: storyPrompts[4] },
  { id: 5, prompt: storyPrompts[5] }
];

export default StoryPrompts;
