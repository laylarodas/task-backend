import type { Request, Response } from "express";
import Note, { INote } from "../models/Note";

export class NoteController {
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const { content } = req.body;
        const note = new Note()
        note.content = content;
        note.createdBy = req.user._id;
        note.task = req.task._id;

        
        
        console.log(note)
        req.task.notes.push(note._id);

        try {
            await Promise.allSettled([req.task.save(), note.save()]);
            res.send('Note created successfully')
        } catch (error) {
            res.status(500).json({ error: 'Server error'})
        }
    }
}