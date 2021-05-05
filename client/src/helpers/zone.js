export default class Zone{
    constructor(scene, x, y, width, height, pileType) {
        this.renderZone =  () => {
            let dropZone = scene.add.zone(x, y).setRectangleDropZone(width, height);
            dropZone.setData({
                cards: 0,
                pile: pileType
            });
            console.log(dropZone);
            return dropZone;
        };
        this.renderOutline = (dropZone) => {
            // let dropZoneOutline = scene.add.graphics();
            // dropZoneOutline.lineStyle(4, 0xff69b4);
            // dropZoneOutline.strokeRect(dropZone.x = dropZone.input.hitArea.width/2, dropZone.y = dropZone.input.hitArea.height/2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
            
            let hitZoneOutline = scene.add.graphics();
            hitZoneOutline.lineStyle(4, 0xaaeeff);
            hitZoneOutline.strokeRect(dropZone.x, dropZone.y, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
        
        }
    }
}