import React from 'react';

import AppConfiguration from '../model/AppConfiguration';

const config: AppConfiguration = {
  serverDBTable: "artwork",
  serverAPIRoot: "[your-server-api-endpoint]",
  autoLoginPassword: false,
  branding: {
    loginScreenImageSrc: "one-minute-icon-dark.svg",
    loginScreenImageSize: "normal",
    loginScreenBackground: "#37474F",
    loginScreenTheme: "dark"
  },
  dialog: {
    storyPrompts: {
      1: "Begin storytelling by describing the immediately noticeable element(s) in the artwork. What can you see with your own eyes?",
      2: "Evoke curiosity with a statement, or perhaps a question, that leads up to the main interpretive content (the plot).",
      3: "Explain and enlighten the reader with the plot of the story. Break the story into two sections: this is the first part.",
      4: "Explain and enlighten the reader with the plot of the story. Break the story into two sections: ... and now for the second part.",
      5: "Round up the story, leaving the reader with a curious mind, perhaps wanting more."
    },
    introScreenDesktop: {
      welcomeMessage: "Welcome to the One Minute Story Editor",
      introHTML: (
        <>
          <p>
            You can use this tool to write short, informal stories about the objects you see in this museum. Visitors can use the One Minute mobile app to scan objects and read these stories.
          </p>
          <h3>
            Getting Started
          </h3>
          <p>
            First, find an object on our online collection that interests you. You can use this tool to write a story about that object.
          </p>
          <h3>
            Writing with a plot
          </h3>
          <p>
            When writing, choose an angle that will become the "plot" of the story. For example, if you were looking at a painting, frame the story around the artist's painting technique or how it depicts the people and places in that painting.
          </p>
          <p>&nbsp;</p>
        </>
      )
    },
    introScreenMobile: {
      welcomeMessage: "Welcome to the One Minute Story Editor",
      introHTML: (
        <>
          <p>
            You can use this tool to write short, informal stories about the objects you see in this museum.
          </p>
          <h3>
            Getting Started
          </h3>
          <p>
            First, find an object in the museum that interests you. Tap the menu icon to browse some of the examples we've provided for you, or you can start writing your own story by tapping 'Add New'.
          </p>
          <h3>
            Writing with a plot
          </h3>
          <p>
            When writing, choose an angle that will become the "plot" of the story. For example, if you were looking at a painting, frame the story around the artist's painting technique or how it depicts the people and places in that painting.
          </p>
          <p>&nbsp;</p>
        </>
      )
    }
  }
};

export default config;
