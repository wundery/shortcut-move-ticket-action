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
        responseType: 'json'
      })
      .json()

    const task = story.tasks.find((task) => task.description === description)
    if (task) {
      console.log(`Task already exists: ${task.id} - ${task.description}`)
      return task
    }
  } catch (err) {
    return err
  }

  try {
    console.log(`create task for ${storyId} - ${description}`)
    return await got
      .post(`${shortcutStoriesUrl}/${storyId}/tasks`, {
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
  } catch (err) {
    return err
  }
}
