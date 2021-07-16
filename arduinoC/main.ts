
enum SIZE {
    //% block="29*29"
    1,
    //% block="58*58"
    2
}

enum LINE {
    //% block="1"
    1,
    //% block="2"
    2,
    //% block="3"
    3,
    //% block="4"
    4
}

enum BTN {
    //% block="A"
    A,
    //% block="B"
    B,
    //% block="A+B"
    AB
}

enum IO {
    //% block="D2"
    D2,
    //% block="D3"
    D3,
    //% block="D4"
    D4,
    //% block="D7"
    D7,
    //% block="D8"
    D8,
    //% block="D9"
    D9
}


//% color="#AA278D" iconWidth=50 iconHeight=40
namespace oled12864 {


    //% block="设置颜色2 [COLOR]" blockType="command"
    //% COLOR.shadow="colorPalette"     
    export function setColor2(parameter: any, block: any) {
        // let color = parameter.COLOR.code;    
        Generator.addObject(`myoled`, `uint32_t`, `color=${parameter.COLOR.code};`);
        Generator.addObject(`color.r`, `int`, `r=((color >> 16) & 0xFF);`);
        Generator.addObject(`color.g`, `int`, `g=((color >> 8 ) & 0xFF);`);
        Generator.addObject(`color.b`, `int`, `b=((color      ) & 0xFF);`);
    }


    
    //% block="show [STR] on the [IO] line" blockType="command"
    //% IO.shadow="dropdownRound" IO.options="IO" IO.defl="IO.D2"
    //% STR.shadow="range" STR.params.min=0 STR.params.max=64 STR.defl=64
    export function initRGB(parameter: any, block: any) {
        let str = parameter.STR.code
        let io = parameter.IO.code

        let pin
        switch(io) {
            case "D2":
                pin = 25
                break;
            case "D3":
                pin = 26
                break;
            case "D4":
                pin = 27
                break;
            case "D5":
                pin = 9
                break;
            case "D6":
                pin = 10
                break;
            case "D7":
                pin = 13
                break;
            case "D8":
                pin = 5
                break;
            case "D9":
                pin = 2
                break;
        }
        

        Generator.addInclude('addHeader', `#include <Adafruit_NeoPixel.h>\n#ifdef __AVR__\n\t#include <avr/power.h>\n#endif`);
        Generator.addInclude(`setPin`, `#define PIN ${pin}`);
        Generator.addInclude(`setNum`, `#define NUMPIXELS ${str}`);
        Generator.addObject(`startPixel`, `Adafruit_NeoPixel`, `pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);`)

        Generator.addSetup(`begin`, `pixels.begin();\n\tpixels.show();`)
    }


    export function getBuiltinFunc_() {
        return [
            {matrix: "0101011111111110111000100"},
            {matrix: "0000001010011100010000000"},
            {matrix: "0010001110101010010000100"},
            {matrix: "0010000100101010111000100"},
            {matrix: "0010001000111110100000100"}
        ]
    }

    //% block="设置点阵 [MT]" blockType="command"
    //% MT.shadow="matrix" MT.params.row=8 MT.params.column=8 MT.defl="0101011111111110111000100"
    //% MT.params.builtinFunc="getBuiltinFunc_" 
    export function setMatrix(parameter: any, block: any) {
        let matrix = parameter.MT.code;
        Generator.addCode(`char matrix[] = "${matrix}";`);
        Generator.addCode(`for (int i=0; i<NUMPIXELS; i++) {\n\tif (matrix[i] == '1') {\n\t\tpixels.setPixelColor(i, pixels.Color(r,g,b));\n\t\tpixels.show();\n\t}\n}`)    
    }

    //% block="设置亮度 [STR]" blockType="command"
    //% STR.shadow="range" STR.params.min=0 STR.params.max=255 STR.defl=255
    export function setLight(parameter: any, block: any) {
        let str = parameter.STR.code
        Generator.addSetup(`set Light`,`pixels.setBrightness(${str});`);
    }



}
