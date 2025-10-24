import { osSpecificPath } from '../path'

export function header(
  workspaceRoot: string,
  message: string,
  targetOS: 'windows' | 'unix',
): string[] {
  return targetOS === 'windows'
    ? [
        '@echo off',
        `cd /d "${osSpecificPath(workspaceRoot, targetOS)}"`,
        `echo ${message}`,
        '',
      ]
    : ['#!/bin/bash', `echo "${message}"`, '']
}
