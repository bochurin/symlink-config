declare module '*/package.json' {
  interface PackageJson {
    displayName: string
    description: string
    version: string
    contributes: {
      configuration: {
        title: string
        properties: Record<
          string,
          {
            default: any
          }
        >
      }
    }
  }

  const value: PackageJson
  export default value
}
