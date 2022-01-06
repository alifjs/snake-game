let canvas= document.querySelector('canvas')
let ctx=canvas.getContext('2d')

let snake=[]
function Box_constructor(y){
    this.x=60
    this.y=y
    this.dx=0
    this.dy=0//-20
}
let food_coordinates=generate_new_food_coordinates()
function did_snake_eat(){
    if(snake[0].x==food_coordinates[0] && snake[0].y==food_coordinates[1]){
        return true
    }else{
        return false
    }
}
function generate_new_food_coordinates(){
    let x_coordinate=0
    let y_coordinate=0
    while(true){
        x_coordinate=20*Math.floor(Math.random()*25)
        y_coordinate=20*Math.floor(Math.random()*25)
        let counter=0
        for(let i=0;i< snake.length;i++){
            if(x_coordinate != snake[i].x || y_coordinate != snake[i].y){
                counter++
            }else{
                break
            }
        }
        if(counter==snake.length){
            break
        }    
    }
    return [x_coordinate,y_coordinate]
}
function grow_snake(){
    if(snake[snake.length-1].dx > 0){//tail moving right
       snake.push(new Box_constructor(snake[snake.length-1].y))
       snake[snake.length-1].x=snake[snake.length-2].x-20
       snake[snake.length-1].dx=20
       snake[snake.length-1].dy=0
    }else if(snake[snake.length-1].dx < 0){//tail moving left
       snake.push(new Box_constructor(snake[snake.length-1].y))
       snake[snake.length-1].x=snake[snake.length-2].x+20
       snake[snake.length-1].dx=-20
       snake[snake.length-1].dy=0
    }else if(snake[snake.length-1].dy < 0){//tail moving up
       snake.push(new Box_constructor(snake[snake.length-1].y+20))
       snake[snake.length-1].x=snake[snake.length-2].x
       snake[snake.length-1].dx=0
       snake[snake.length-1].dy=-20
    }else if(snake[snake.length-1].dy > 0){//tail moving down
       snake.push(new Box_constructor(snake[snake.length-1].y-20))
       snake[snake.length-1].x=snake[snake.length-2].x
       snake[snake.length-1].dx=0
       snake[snake.length-1].dy=20
    }
}
function collision_check(){
    let collision_status=false
    if(snake[0].x < 0 || snake[0].x+20 > canvas.width || snake[0].y < 0 || snake[0].y+20 > canvas.height){
        collision_status=true
    }
    if(collision_status==false){
        for(let i=1;i< snake.length;i++){
            if(snake[0].x==snake[i].x && snake[0].y==snake[i].y){
                collision_status=true
                break
            }
        }
    }
    return collision_status
}
for(let i=0;i<10;i++){
    let box=new Box_constructor(340+i*20)
    snake.push(box)
}
let counter=0
let score=0
function move(){
    if(counter%10 == 0 && counter != 0){
        change_dx_and_dy()
        for(let i=0;i<snake.length;i++){
            snake[i].x+=snake[i].dx
            snake[i].y+=snake[i].dy
        }
        if(collision_check()==true){
            alert('Game over!')
        }
        reset_direction_coordinates()
        ctx.clearRect(0,0,canvas.width,canvas.height)
        for(let i=0;i<snake.length;i++){
            ctx.beginPath()
            ctx.fillStyle='black'
            ctx.fillRect(snake[i].x,snake[i].y,20,20)
            ctx.beginPath()
            ctx.fillStyle='purple'
            ctx.fillRect(snake[i].x+2,snake[i].y+2,16,16)
        }
        if(did_snake_eat()==true){
            score++
            document.querySelector('h1').textContent='Score : ' + score.toString()
            grow_snake()
            food_coordinates=generate_new_food_coordinates()
        }
        ctx.beginPath()
        ctx.fillStyle='green'
        ctx.fillRect(food_coordinates[0],food_coordinates[1],20,20)
    }
    counter++
    requestAnimationFrame(move)
}

document.addEventListener('keydown',direction_change)
move()


let right_coordinates=[]
let left_coordinates=[]
let up_coordinates=[]
let down_coordinates=[]

function direction_change(e){
    if(e.key=='ArrowRight' && (snake[0].dx==0 && snake[0].dy != 0)){//snake head is not moving to the right/left and isn't static
        right_coordinates.push([snake[0].x,snake[0].y])
    }else if(e.key=='ArrowLeft' && (snake[0].dx==0 && snake[0].dy != 0)){//snake head is not moving to the right/left and isn't static
        left_coordinates.push([snake[0].x,snake[0].y])
    }else if(e.key=='ArrowUp'&& (snake[0].dy==0)){//snake head isn't moving up/down or it is static
        if((snake[0].dy==0 && snake[0].dx==0)){
            for(let i=0;i<snake.length;i++){
                snake[i].dy=-20
            }
        }
        up_coordinates.push([snake[0].x,snake[0].y])
    }else if(e.key=='ArrowDown' && (snake[0].dy==0 && snake[0].dx != 0)){//snake head isn't moving up/down and isn't static
        down_coordinates.push([snake[0].x,snake[0].y])
    }
}
function change_dx_and_dy(){
    for(let i=0;i<snake.length;i++){
        for(let w in right_coordinates){
            if(snake[i].x==right_coordinates[w][0] && snake[i].y==right_coordinates[w][1]){
                snake[i].dy=0
                snake[i].dx=20
            }
        }
        for(let w in left_coordinates){
            if(snake[i].x==left_coordinates[w][0] && snake[i].y==left_coordinates[w][1]){
                snake[i].dy=0
                snake[i].dx=-20
            }
        }
        for(let w in up_coordinates){
            if(snake[i].x==up_coordinates[w][0] && snake[i].y==up_coordinates[w][1]){
                snake[i].dy=-20
                snake[i].dx=0
            }
        }
        for(let w in down_coordinates){
            if(snake[i].x==down_coordinates[w][0] && snake[i].y==down_coordinates[w][1]){
                snake[i].dy=20
                snake[i].dx=0
            }
        }
    }
}

function reset_direction_coordinates(){
    for(let w in right_coordinates){
        let counter2=0
        for(let i=0;i<snake.length;i++){
            if(snake[i].x != right_coordinates[w][0] || snake[i].y != right_coordinates[w][1]){
                counter2++
            }
        }
        if(counter2==snake.length){
            right_coordinates.splice(w*1,1)
        }
    }
    for(let w in left_coordinates){
        let counter2=0
        for(let i=0;i<snake.length;i++){
            if(snake[i].x != left_coordinates[w][0] || snake[i].y != left_coordinates[w][1]){
                counter2++
            }
        }
        if(counter2==snake.length){
            left_coordinates.splice(w*1,1)
        }
    }
    for(let w in up_coordinates){
        let counter2=0
        for(let i=0;i<snake.length;i++){
            if(snake[i].x != up_coordinates[w][0] || snake[i].y != up_coordinates[w][1]){
                counter2++
            }
        }
        if(counter2==snake.length){
            up_coordinates.splice(w*1,1)
        }
    }
    for(let w in down_coordinates){
        let counter2=0
        for(let i=0;i<snake.length;i++){
            if(snake[i].x != down_coordinates[w][0] || snake[i].y != down_coordinates[w][1]){
                counter2++
            }
        }
        if(counter2==snake.length){
            down_coordinates.splice(w*1,1)
        }
    }
}






