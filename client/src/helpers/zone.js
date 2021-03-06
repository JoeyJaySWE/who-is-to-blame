export default class Zone{
    constructor(scene, x, y, width, height, pileType) {
        this.renderZone =  () => {
            let dropZone = scene.add.zone(x, y).setRectangleDropZone(width, height);
            dropZone.setData({
                cards: 0,
                pile: pileType,
                cardData: []
            });

            return dropZone;
        };
        this.renderOutline = (dropZone) => {
         
            let hitZoneOutline = scene.add.graphics();
            hitZoneOutline.lineStyle(4, 0xaaeeff);
            hitZoneOutline.strokeRect(dropZone.x, dropZone.y, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
        
        }
    }
}