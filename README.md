# pxt-kitronik-memsmic

# Kitronik blocks for micro:bit

Blocks that support [Kitronik kits and shields for the micro:bit](https://www.kitronik.co.uk/microbit.html)
This package is for the [Kitronik MEMS Mic]

Read sound level block readys the current sound level from the microphone:
```blocks
basic.showNumber(Kitronik_microphone.readSoundLevel())
```

Wait for clap block run the code inside once the microphone hear a selected number of claps in a selected time period
```blocks
Kitronik_microphone.waitForClap(1, 1000, function () {
    basic.showIcon(IconNames.Heart)
	basic.pause(1000)
	basic.clearScreen()
})
```

## License

MIT

