// Note: osSpecificPath functionality needs to be implemented using shared abstractions

export function header(
  workspaceRoot: string,
  message: string,
  targetOS: 'windows' | 'unix',
): string[] {
  // TODO: Implement osSpecificPath using shared abstractions
  const formattedRoot = workspaceRoot // osSpecificPath(workspaceRoot, targetOS)
  return targetOS === 'windows'
    ? [
        '@echo off',
        `cd /d "${formattedRoot}"`,
        `echo ${message}`,
        '',
      ]
    : ['#!/bin/bash', `echo "${message}"`, '']
}
