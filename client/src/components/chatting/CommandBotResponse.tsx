import { CommandCategory } from "../../utils/CommandCategory"
import FileSystemItem from "../files/FileSystemItem"

interface commandBotProps {
  commandBotInfo: any
}

const CommandBotResponse = ({commandBotInfo}: commandBotProps) => {
  return (
    <div className="command-bot-chat-container">
      <h4 style={{color: 'var(--button)'}}>Command Bot</h4>
      <h4>Command Summary Message</h4>
      {commandBotInfo[1] === CommandCategory.ViewFileSystemItem ? (
        <FileSystemItem props={commandBotInfo[2]} />
      ) : []}
    </div>
  )
}
export default CommandBotResponse