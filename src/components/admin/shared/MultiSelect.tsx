import * as React from "react"
import { Check, ChevronsUpDown, X, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { AnimatePresence, motion } from "framer-motion"

export type Option = {
    label: string
    value: string
    image?: string
}

interface MultiSelectProps {
    options: Option[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
    className?: string
    color?: string
    creatable?: boolean  // allow typing custom values
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select items...",
    className,
    color = "cyan",
    creatable = true,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [previewImage, setPreviewImage] = React.useState<string | null>(null)
    const [search, setSearch] = React.useState("")

    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value))
        } else {
            onChange([...selected, value])
        }
        setSearch("")
    }

    const handleRemove = (value: string) => {
        onChange(selected.filter((item) => item !== value))
    }

    const addCustom = (val: string) => {
        const trimmed = val.trim()
        if (!trimmed || selected.includes(trimmed)) return
        onChange([...selected, trimmed])
        setSearch("")
    }

    const themeColorText = color === "purple" ? "text-purple-400" : "text-cyan-400";
    const themeColorBg = color === "purple" ? "bg-purple-500/10" : "bg-cyan-500/10";
    const themeColorBorder = color === "purple" ? "border-purple-500/20" : "border-cyan-500/20";
    const themeHoverBg = color === "purple" ? "hover:bg-purple-500/20" : "hover:bg-cyan-500/20";
    const themeSelectedBg = color === "purple" ? "aria-selected:bg-purple-500/20" : "aria-selected:bg-cyan-500/20";

    // Filtered options based on current search
    const filteredOptions = options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase())
    )
    const exactMatch = options.some(o => o.label.toLowerCase() === search.toLowerCase())
    const showCreateOption = creatable && search.trim().length > 0 && !exactMatch && !selected.includes(search.trim())

    return (
        <div className={cn("space-y-3", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/5 active:scale-[0.98] transition-all"
                    >
                        {placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-[300px] w-full p-0 bg-[#0c0c0c] border-white/10 text-white shadow-xl backdrop-blur-xl" align="start">
                    <Command className="bg-transparent" shouldFilter={false}>
                        <CommandInput
                            placeholder="Type to search or add custom..."
                            className="text-white border-0 focus:ring-0"
                            value={search}
                            onValueChange={setSearch}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && showCreateOption) {
                                    e.preventDefault();
                                    addCustom(search);
                                    setOpen(false);
                                }
                            }}
                        />
                        <CommandList className="custom-scrollbar max-h-[300px]">
                            {/* Create option — shown when typed value doesn't match any existing */}
                            {showCreateOption && (
                                <CommandGroup heading="Add custom">
                                    <CommandItem
                                        value={`__create__${search}`}
                                        onSelect={() => { addCustom(search); setOpen(false); }}
                                        className="cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-2 text-emerald-400"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add &ldquo;{search.trim()}&rdquo;
                                    </CommandItem>
                                </CommandGroup>
                            )}
                            <CommandGroup heading={filteredOptions.length ? "Suggestions" : undefined}>
                                {filteredOptions.length === 0 && !showCreateOption && (
                                    <p className="py-4 text-center text-xs text-gray-500">No suggestions. Type to add custom.</p>
                                )}
                                {filteredOptions.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => { handleSelect(option.value); setOpen(false); }}
                                        className={cn(
                                            "cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-2",
                                            themeSelectedBg
                                        )}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                themeColorText,
                                                selected.includes(option.value) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.image && (
                                            <div
                                                className="w-6 h-6 rounded bg-white/10 overflow-hidden flex-shrink-0 cursor-zoom-in"
                                                onClick={(e) => { e.stopPropagation(); setPreviewImage(option.image!); }}
                                            >
                                                <img src={option.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <span>{option.label}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {selected.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selected.map((value) => {
                        const option = options.find((o) => o.value === value)
                        // Show badge for both known options AND custom values
                        return (
                            <Badge
                                key={value}
                                variant="secondary"
                                className={cn(
                                    "pl-1 pr-1 py-1 flex items-center gap-2 transition-all border group",
                                    themeColorBg,
                                    themeColorText,
                                    themeColorBorder,
                                    themeHoverBg
                                )}
                            >
                                {option?.image && (
                                    <div
                                        className="w-5 h-5 rounded-sm bg-black/20 overflow-hidden cursor-zoom-in hover:scale-110 transition-transform"
                                        onClick={(e) => { e.stopPropagation(); setPreviewImage(option.image!); }}
                                    >
                                        <img src={option.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <span className={cn("text-xs", !option?.image && "pl-1")}>{option?.label ?? value}</span>
                                <button
                                    className="ml-1 rounded-full p-0.5 transition-colors hover:bg-black/20"
                                    onClick={(e) => { e.stopPropagation(); handleRemove(value); }}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )
                    })}
                </div>
            )}

            {/* Image Preview Overlay */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-8 cursor-pointer backdrop-blur-sm"
                        onClick={() => setPreviewImage(null)}
                    >
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={previewImage}
                            alt="Preview"
                            className="max-w-full max-h-full rounded-lg shadow-2xl border border-white/10"
                        />
                        <button className="absolute top-4 right-4 text-white/50 hover:text-white">
                            <X size={32} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
