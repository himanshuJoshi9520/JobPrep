import Question from "../models/question.model.js";
import axios from "axios";

export const getQuestionsByCompany = async (req, res) => {
  try {
    const { company } = req.query;
    const companyFilter = company ? company.toLowerCase() : "google";
    const questions = await Question.find({ company: companyFilter });
    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Failed to fetch questions", error: error.message });
  }
};

export const runCode = async (req, res) => {
  const { exec } = await import('child_process');
  const { writeFile, unlink, mkdir } = await import('fs/promises');
  const { join } = await import('path');
  const { tmpdir } = await import('os');

  const { language, code } = req.body;

  const id = `run_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const dir = join(tmpdir(), id);

  try {
    await mkdir(dir, { recursive: true });

    let cmd;
    let filePath;

    if (language === 'javascript') {
      filePath = join(dir, 'main.js');
      await writeFile(filePath, code);
      cmd = `node "${filePath}"`;

    } else if (language === 'python') {
      filePath = join(dir, 'main.py');
      await writeFile(filePath, code);
      cmd = `python "${filePath}"`;

    } else if (language === 'java') {
      // Extract class name from code or default to Main
      const classMatch = code.match(/public\s+class\s+(\w+)/);
      const className = classMatch ? classMatch[1] : 'Main';
      filePath = join(dir, `${className}.java`);
      await writeFile(filePath, code);
      cmd = `javac "${filePath}" -d "${dir}" && java -cp "${dir}" ${className}`;

    } else if (language === 'cpp') {
      filePath = join(dir, 'main.cpp');
      const outPath = join(dir, 'main.exe');
      await writeFile(filePath, code);
      cmd = `g++ "${filePath}" -o "${outPath}" && "${outPath}"`;

    } else {
      return res.status(400).json({ output: `Unsupported language: ${language}`, error: true });
    }

    const output = await new Promise((resolve) => {
      exec(cmd, { timeout: 10000, cwd: dir }, (err, stdout, stderr) => {
        resolve(stdout || stderr || (err ? err.message : 'No output.'));
      });
    });

    res.status(200).json({ output, error: false });

  } catch (err) {
    console.error('runCode error:', err.message);
    res.status(500).json({ output: `Server Error: ${err.message}`, error: true });
  } finally {
    // Cleanup temp dir silently
    try {
      const { rm } = await import('fs/promises');
      await rm(dir, { recursive: true, force: true });
    } catch {}
  }
};
