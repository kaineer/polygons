#!/bin/bash

# $ ./script.sh --> asks for password and makes sudo
# # ./script.sh --> just runs chown without any need for sudo

please() {
  if [[ "$USER" == "root" ]]; then
    eval "$@"
  else
    eval "sudo $@"
  fi
}

please chown root:root ./README.md
