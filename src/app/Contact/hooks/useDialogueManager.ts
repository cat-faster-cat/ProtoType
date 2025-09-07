import { useState } from 'react';
import { dialogueData, DialogueNode } from '../dialogueData';

export function useDialogueManager(initialNodeKey: string) {
  const [currentNodeKey, setCurrentNodeKey] = useState(initialNodeKey);
  const [restartCount, setRestartCount] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Set<string>>(new Set());
  // 「完了した分岐」を、restartに至った終端ノードのキーで管理する
  const [completedEndNodes, setCompletedEndNodes] = useState<Set<string>>(new Set());
  const [glitchNoticeShown, setGlitchNoticeShown] = useState(false);

  const currentNode: DialogueNode = dialogueData[currentNodeKey];

  // 表示ロジックを、「完了した分岐」の数で判定する
  const showHelpLink = completedEndNodes.size >= 3;
  const helpLinkSize = completedEndNodes.size >= 4 ? 0.8 + (completedEndNodes.size - 3) * 0.2 : 0.8;
  const helpLinkColor = completedEndNodes.size >= 8 ? 'red' : 'gray';

  // 遷移ロジックをここに集約
  const handleTransition = (nextId: string) => {
    let finalNextId = nextId;

    // 会話が 'restart' に至った時が、分岐完了のタイミング
    if (nextId === 'restart') {
      setRestartCount(prev => prev + 1);

      // どのノードから restart に来たかを記録
      const newCompletedEndNodes = new Set(completedEndNodes).add(currentNodeKey);
      setCompletedEndNodes(newCompletedEndNodes);

      // この完了によって初めて分岐数が3になり、まだ「気づいて」が表示されていなければ
      if (newCompletedEndNodes.size === 3 && !glitchNoticeShown) {
        // 次の遷移先を 'restart' から 'glitch_notice' に上書きする
        finalNextId = 'glitch_notice';
        setGlitchNoticeShown(true);
      }
    }
    setCurrentNodeKey(finalNextId);
  };

  // 選択肢クリック時の処理
  const selectChoice = (parentNodeKey: string, nextId: string) => {
    // UIのチェックマーク表示用に、選択したことだけ記録
    setSelectedChoices(prev => new Set(prev).add(nextId));
    handleTransition(nextId);
  };

  return {
    currentNode,
    currentNodeKey,
    selectChoice,
    handleTransition,
    showHelpLink,
    helpLinkSize,
    helpLinkColor,
    selectedChoices,
    // 外部APIの互換性のために completedNodes を維持するが、実体は completedEndNodes
    completedNodes: completedEndNodes,
  };
}
