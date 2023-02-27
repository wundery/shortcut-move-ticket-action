import got from 'got'

const shortcutStoriesUrl = 'https://api.app.shortcut.com/api/v3/stories'
const shortcutToken = process.env.SHORTCUT_TOKEN

export default async function (storyId, description) {
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
