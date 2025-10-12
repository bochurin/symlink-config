@echo off
echo Building Docker image for Unix testing...
docker build -t symlink-test .

echo.
echo Running core logic test in Linux container...
docker run --rm -v %cd%/test-workspace:/app/test-workspace symlink-test node test-unix.js

echo.
echo Checking created symlinks in container...
docker run --rm -v %cd%/test-workspace:/app/test-workspace symlink-test bash -c "
echo 'Listing test-workspace contents:'
ls -la test-workspace/
echo ''
echo 'Checking for symlinks:'
find test-workspace/ -type l -exec ls -la {} \;
echo ''
echo 'Testing symlink functionality:'
if [ -L test-workspace/container1/types.ts ]; then
  echo '✅ Symlink created: container1/types.ts'
  echo 'Target:' $(readlink test-workspace/container1/types.ts)
else
  echo '❌ Symlink not found: container1/types.ts'
fi
"

pause