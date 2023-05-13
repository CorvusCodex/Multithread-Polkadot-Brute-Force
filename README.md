# Multithread Polkadot Bruteforce by CorvusCodex
This script generates random private keys for the Polkadot blockchain and checks if the corresponding public address is in a list of addresses stored in a file named ‘data.txt’. If a match is found, the script logs the public address and saves the wallet and its private key (seed) to a file named ‘match.txt’. The script uses the cluster module to create worker processes for each CPU and runs the generate function repeatedly with no delay.

## Installation
1. Clone this repository
2. Run npm install to install dependencies

## Usage
1. Add the addresses you want to check against to a file named ‘data.txt’, with one address per line.
2. Run node index.js to start the script.

## Support
Support my work:
BTC: bc1q7wth254atug2p4v9j3krk9kauc0ehys2u8tgg3
ETH & BNB: 0x68B6D33Ad1A3e0aFaDA60d6ADf8594601BE492F0
Buy me a coffee: https://www.buymeacoffee.com/CorvusCodex

## License
This project is licensed under the MIT License.
