import { useState } from 'react'
import { Equipment } from './workout-tracker'
import { Button } from "@/components/ui/button"
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from 'framer-motion'

type EquipmentManagerProps = {
  equipment: Equipment[]
  addEquipment: (equipment: Equipment) => void
  removeEquipment: (equipmentId: string) => void
}

export default function EquipmentManager({ equipment, addEquipment, removeEquipment }: EquipmentManagerProps) {
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false)
  const [newEquipment, setNewEquipment] = useState({ name: '', quantity: 1 })

  const handleAddEquipment = () => {
    if (newEquipment.name) {
      addEquipment({
        id: Date.now().toString(),
        name: newEquipment.name,
        quantity: newEquipment.quantity
      })
      setNewEquipment({ name: '', quantity: 1 })
      setIsAddEquipmentOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Equipment</h2>
        <Button onClick={() => setIsAddEquipmentOpen(true)} className="glassmorphic">
          <PlusIcon className="mr-2 h-4 w-4" /> Add Equipment
        </Button>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {equipment.map((item) => (
          <motion.li
            key={item.id}
            className="flex items-center justify-between p-4 glassmorphic rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <span>{item.name} (x{item.quantity})</span>
            <Button variant="ghost" size="sm" onClick={() => removeEquipment(item.id)}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </motion.li>
        ))}
      </ul>
      <Dialog open={isAddEquipmentOpen} onOpenChange={setIsAddEquipmentOpen}>
        <DialogContent className="glassmorphic">
          <DialogHeader>
            <DialogTitle>Add New Equipment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="equipmentName">Equipment Name</Label>
              <Input
                id="equipmentName"
                value={newEquipment.name}
                onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                placeholder="e.g., Dumbbells"
              />
            </div>
            <div>
              <Label htmlFor="equipmentQuantity">Quantity</Label>
              <Input
                id="equipmentQuantity"
                type="number"
                value={newEquipment.quantity}
                onChange={(e) => setNewEquipment({ ...newEquipment, quantity: parseInt(e.target.value) || 1 })}
                min={1}
              />
            </div>
            <Button onClick={handleAddEquipment}>Add Equipment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

