import core from '@actions/core'
import github from '@actions/github'
import getStoryId from './getStoryId.js'
import shortcutMoveStoryState from './moveState.js'
import shortcutCreateTask from './createTask.js'

async function run() {
  const context = github.context
  if ((!context && !context.payload) || !context.payload.pull_request) {
    core.setFailed('Context or pull request not found.')
  }

  const shortcutStoryPrefix = core.getInput('shortcut_story_prefix')
  const storyId = getStoryId(context.payload.pull_request, shortcutStoryPrefix)

  if (!storyId || storyId === null) {
    core.info('No story ID found.')
    return
  }

  const shortcutToken = process.env.SHORTCUT_TOKEN
  if (!shortcutToken || shortcutToken.length <= 0) {
    core.setFailed('Missing Shortcut API Token.')
    return
  }

  const shortcutTargetStateId = core.getInput('shortcut_ready_state_id')
  const shortcutTaskDescription = core.getInput('shortcut_task_description')

  const move = await shortcutMoveStoryState(storyId, shortcutTargetStateId)
  if (!move || move.statusCode !== 200) {
    core.setFailed(move)
  }

  if (shortcutTaskDescription) {
    const task = await shortcutCreateTask(storyId, shortcutTaskDescription)
    if (!task || task.statusCode !== 200) {
      core.setFailed(task)
    }
  }
}

run()
