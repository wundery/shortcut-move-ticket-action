import got from 'got'

const shortcutStoriesUrl = 'https://api.app.shortcut.com/api/v3/stories'
const shortcutToken = process.env.SHORTCUT_TOKEN

export default async function (storyId, description) {
  try {
    const story = await got
      .get(`${shortcutStoriesUrl}/${storyId}`, {
        headers: {
          'Shortcut-Token': shortcutToken,
          'Content-Type': 'application/json'
        },
        json: {
          description
        },
        responseType: 'json'
      })
      .json()

    const task = story.tasks.find((task) => task.description === description)
    if (task) {
      return
    }
  } catch (err) {
    return err
  }

  try {
    const response = await got.put(`${shortcutStoriesUrl}/${storyId}/tasks`, {
      headers: {
        'Shortcut-Token': shortcutToken,
        'Content-Type': 'application/json'
      },
      json: {
        description
      },
      responseType: 'json'
    })
    return response
  } catch (err) {
    return err
  }
}
