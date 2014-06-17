# ix, an image processing language

## Getting started

Open `ix.html` in your browser (tested with modern Chromes and Firefoxes) and off you go.

Online version here: --> http://akx.github.io/ix/ix.html <--

## Building

    npm install -g gulp
    npm install
    gulp app

## Overview

ix is built mostly for [glitch art](http://reddit.com/r/glitch_art) usage instead of serious image processing (though I suspect it can do that too). The language itself is mostly [stack-based](http://en.wikipedia.org/wiki/Stack-oriented_programming_language) with its own idiosyncratic quirks, and there are plenty of ways to make "happy accidents" happen -- which is part of the fun, really!

The data model -- that is, the input and output image buffers -- are HTML5 image data, i.e. arrays of 8-bit pixels arranged in an interleaved RGBA order. ix itself ignores the A (alpha) channel, but with clever manipulation of the `roff` and `woff` variables, you can read and write alpha too.

ix code is executed for each input pixel, in top-down, left-right order, unless overridden by the code itself. An empty ix program will simply copy the input image into the output buffer thanks to the environment copying the source color values into the same variables that are used for writing into the output buffer. If that made no sense, read on.

Variables and stack in the ix language are floats (that is, decimal values), but most read/write operations nevertheless treat them as integers, truncating any decimal part (instead of rounding it). However, arithmetic operations use full floating point precision, so dividing 4 by 5 will give you 0.8, not 0.

Programs are executed for 10 seconds at maximum (give or take -- the accounting isn't exactly bullet-proof).

Unless another source image is specified (as one should be!), there's a built-in [Lenna](http://en.wikipedia.org/wiki/Lenna) for trying things out.

## Variables

These variables have a special meaning in the ix language:

* `x` -- the current X (left to right) coordinate being iterated over. Ranges from 0 to the image's width.
* `y` -- the current Y (top to bottom) coordinate being iterated over. Ranges from 0 to the image's height.
* `w` -- the width of the image being processed. (Yes, you can write into this variable.)
* `h` -- the height of the image being processed. (Yes, you can write into this variable too.)
* `dx` -- destination X value.  
  While every pixel is being processed in the source image, you can nevertheless write into other pixels in the destination image with `dx` and `dy`. This is useful for displacement effects, and it has a very special meaning when the `sourcemap` flag is used (see below).
* `dy` -- destination Y value. See above.
* `xd` -- X movement value. By default, this is set to +1, i.e. every horizontal pixel is iterated over.
* `yd` -- Y movement value. See above for `xd`. This value is only used when `x` becomes out-of-bounds for the image.
* `xwrap` -- flag for wrapping horizontal coordinates when writing. When set, this means writes outside the boundaries of the image will wrap within the same line instead of wrapping onto the next line (thanks to the linear bitmap data model).
* `ywrap` -- same as `xwrap`, but for vertical coordinates.
* `rwrap` -- read offset wrap. If set, reads outside the full image bounds (W * H * 4) will wrap.
* `wwrap` -- write offset wrap. If set, writes outside the full image bounds (W * H * 4) will also wrap.
* `woff` -- write offset. Raw byte offset for writes.
* `roff` -- read offset. Raw byte offset for reads (for pixels after this is set, naturally, but whatever)
* `u` -- slider 1 in the default shell, ranging from -255 to +255
* `i` -- slider 2 in the default shell, ranging from -255 to +255
* `o` -- slider 3 in the default shell, ranging from -255 to +255 

## Meta-variables

These meta-variables can be read from, but not written to.

* `top` -- the value on the top of the stack (peeked, not popped).
* `luma` -- the relative luminance of the current RGB value, ranging from 0 to 1.
* `hue` -- the HSV hue of the current RGB value, ranging from 0 to 1.
* `sat` -- the HSL saturation of the current RGB value, ranging from 0 to 1.
* `val` -- the HSV value of the current RGB value, ranging from 0 to 1.
* `light` -- the HSL lightness of the current RGB value, ranging from 0 to 1. 
* `dst` -- distance of the current pixel from the center of the image, ranging from 0 to 1.
* `ang` -- angle of the current pixel from the center of the image, ranging from 0 to 1.

# Syntax

As mentioned above, ix is a stack-based language. If you've used (HP's) RPN calculators, the concept may be familiar to you, even if ix's idiosyncratic syntax isn't.

You may freely elide or add whitespace between lexemes, but the only form of commenting is line-based. That is,

```
<x # <-- that's ix code but everything up to a newline is a comment
# this line is a comment too
>r
```

is equivalent to 

```
<x>r
```

The ix parser is mostly just a hack on top of a regular expression scanner/tokenizer, so it may not be able to parse everything you throw at it. Luckily the default ix shell, `ix.html`, shows you what could and could not be parsed.

The following table attempts to list the various syntactical elements in the language.

Unless otherwise specified, all forms reading values from the stack also shorten the stack by one value (i.e. pop the value, instead of peeking at it). 

form|meaning
----|-------
`$foo`|enable the flag `foo`
`$foo=bar`|enable the flag `foo` with the value `bar`
`0xABCDEF`|push the hexadecimal value `ABCDEF` onto the stack
`xABCDEF`|push the hexadecimal value `ABCDEF` onto the stack
`0b010110`|push the binary value `010110` onto the stack
`b010110`|push the binary value `010110` onto the stack
`1234`|push the integer `1234` onto the stack
`<a`|load the value of the variable `a` onto the stack
`<a,b,c`|load the values of the variables `a`, `b` and `c` onto the stack (equivalent but faster to `<a<b<c`).
`>b`|save the value on top of the stack into the variable `b`<br>This form accepts multiple target variables, saving the same value into all of them. `>a,b,c` will copy the top of the stack into three separate variables.
`>+b`|Save the value of the variable `b` plus the value on top of the stack into the variable `b` <br>This form also accepts multiple destinations, like the plain `>` form.<br>See the "Arithmetic operations" section for alternatives for `+`.
`>.+b`|Save the value on top of the stack plus the value of the variable `b` into the variable `b`.<br>See above for `>+b`.
`c=3`|Shorthand for assigning a decimal value into a variable.
`?var=9`|Test whether `var` is equal to the decimal constant `9` and jump accordingly. See the "Comparisons" section for alternatives for `=`, and the "Jumps" section.
`?=42`|Test whether the value on top of the stack is equal to the decimal constant `42` and jump accordingly.
`?var=wur`|Test whether the value of variable `var` is equal to the value of variable `wur` and jump accordingly.
`?=wer`|Test whether the value on top of the stack is equal to the value of variable `wer` and jump accordingly. 
`{`, `}` and `else` | Control block delimiters. See the "Jumps" section.
`ident` | Call the function `ident`. `ident` may also be a unique prefix of any declared identifier (that is, `unp` means `unpack`, unless there's, say, `unpoodle` too).
`ident:asdf` | Call the function `ident` with the argument `asdf`.
`+` | Pop two values off the stack, add them and push the result. See the "Arithmetic operations" section for alternatives for `+`.
`.+` | Pop two values off the stack, add them (the other way around, not that this does much difference with commutative operations) and push the result. See the "Arithmetic operations" section for alternatives for `+`.
`a+` | Pop a value off the stack, add the value of variable `a` and push the result. See the "Arithmetic operations" section for alternatives for `+`.
`a.+` | Pop a value off the stack, add the value of variable `a` (the other way around again) and push the result. See the "Arithmetic operations" section for alternatives for `+`.

Confused? That's alright. You'll get the hang of it when you try it out yourself.

### Arithmetic operations

These operations are currently defined for arithmetics.

operator|meaning
--------|-------
`+` |addition
`-` |subtraction
`*` |multiplication
`/` |division
`%` |modulus (division remainder)
`&` |bitwise and
`|` |bitwise or
`^` |bitwise xor
`<<`|shift left
`>>`|shift right

### Comparisons

operator|meaning
--------|-------
`<`|less than
`>`|greater than
`=`|equals
`!`|does not equal
`&`|bitwise and is nonzero
`^`|bitwise xor is nonzero
`|`|bitwise or is nonzero
`%`|bitwise modulo is nonzero

### Jumps

If a conditional form, that is, `?...` is followed by an opening brace, `{`, the ix parser will except a matching end brace, `}` to follow, with an optional `else` form in between. If no opening brace follows the conditional form, the conditional is parsed as the next form being the "true" branch. If the form following that one is the `else` form, the form following _that_ one is parsed as being the "false" branch.

That is to say, the following constructs are equivalent.

> ```?x<10 r=255 else r=0```
> ```?x<10 { r=255 else r=0 }```

If no `else` form immediately follows the "true" branch of an unbraced conditional, the conditional is parsed to have no "false" branch.

> ```?x<10 r=255 thisisalwaysexecuted=1```

The ix language has no concept of loops, labels or backwards jumps (though you can probably do creative things by rewriting `x `and `y`).

## Flags

These flags are currently implemented.

flag|meaning
----|-------
`copy`|Copy the input image into the output buffer before execution.
`recur`|Make the destination image point to the same buffer as the source. Implies `copy`.
`sourcemap`|Have a special meaning for the `dx` and `dy` variables; instead of defining where pixels are written, they define where pixel data is read from. This also implies the usual `r`, `g` and `b` variables are ignored. People who still remember the Winamp Advanced Visualization Studio will know why it's called this.
`sync`|Request synchronous execution of the code (instead of the default, minusculely slower asynchronous execution)
`delay=N`|When in asynchronous mode (the default), wait for `N` milliseconds between steps instead of requesting the next frame immediately
`stepsize=N`|When in asynchronous mode (the default), execute N pixels before redrawing the image onto the screen

## Identifiers

A number of "functions", as it were, are currently implemented as special identifiers.

### `break`

Break execution for this pixel.

### `halt`

Exit the program altogether. Process nothing more.

### `dup`

Make a copy of the value on top of the stack.

### `dup`:`n`

Make N copies of the value on top of the stack.

### `clear`

Clear the stack.

### `swap`

Swap the two values on top of the stack.

### `swizzle`:`spec`

Reorder the top value of the stack according to the `spec` (list of numbers).

For instance, if the stack is `[200, 100, 50]`, and `swizzle:021` is run, the resulting top of the stack will probably be `[200, 50, 100]`. 


### `blend`:`mode`

Set the pixel blending mode. These are mostly useful when the `copy` flag is enabled, though who knows.

Currently implemented modes are `add`, `colorburn`, `colordodge`, `darken`, `difference`, `exclusion`, `hardlight`, `invert`, `lighten`, `linearburn`, `lineardodge`, `multiply`, `none`, `normal`, `overlay`, `screen`, `softlight`, and `subtract`.

Enjoy exploring them.

### `randf`

Push a random floating point number from 0 to 1 onto the stack.

### `rand8`

Push a random integer from 0 to 255 onto the stack.

### `rand16`

Push a random integer from 0 to 65535 onto the stack.

### `abs`

Pop the value on top of the stack, take its absolute (positive) value, then push that.

### `round`

Pop the value on the top of the stack, round it into an integer and push that. 

### `sin`, `cos`, `tan`, `sqrt`, `pow2`, `pow3` (and `abs`*)

Pop the value on top of the stack, apply the given mathematical function to it, then push the result.

Unlike what you may be used to, for convenience the trigonometric functions take values in the 0..1 range instead of 0..2PI.

The `abs` variants (i.e. `abssin`) etc. push the absolute value of the result onto the stack instead of the value itself.

### `pack`:`spec`

Pack the variables declared by `spec` into a single value onto the top of the stack. `spec` should be a list of variables and bit widths, defaulting to `r5g6b5`, i.e. a classical packing of a RGB triplet into 16 bits.

Usage example:

> `pack:r3g3b3 0b101101010 ^ unpack:b3g3r3`

### `unpack`:`spec`

Pop the value on top of the stack and unpack it into variables as declared by `spec`. `spec` defaults to `b5g6r5`, i.e. the inverse of the default of `pack`. Therefore, the ix program `pack unpack` will basically faintly "posterize" the source image. Weird things can be done with unorthodox uses of `pack` and `unpack`, especially so when bitwise operations are applied in-between.

Usage example:

> see above

### `copyline`

Pop `sourceY` and `destY`; copy the full `w` length line of image data from the source image at Y coordinate `sourceY` into the destination image at Y coordinate `destY`.

Usage example (thoroughly hilarious with the default Lenna):

> `<y 30% ?<15 { <y dup 31^ copyline }`


### `samplex`

Pop `xdiff`; sample the image `xdiff` pixels from the current read position and write the values into `r`, `g` and `b`.

Usage example:

> `<x 10% 5- <y + samplex` 


### `sampley`

Pop `ydiff`; sample the image `ydiff` pixels from the current read position and write the values into `r`, `g` and `b`.

### `samplexy`

Pop `xdiff` and `ydiff`, see above.

### `fromhsv`

Read three values from the stack, interpret them as HSV color coordinates and write the resulting RGB values into the RGB variables.

### `loadvsh`

Load the current RGB values onto the stack in HSV color, VSH order. This makes `loadvsh fromhsv` an (approximate) identity program.